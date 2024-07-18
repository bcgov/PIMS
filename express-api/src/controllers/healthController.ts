import { AppDataSource } from '@/appDataSource';
import { Project } from '@/typeorm/Entities/Project';
import { Request, Response } from 'express';
import nunjucks from 'nunjucks';

/**
 * @description Used to check if API is running.
 * @param {Request}     req Incoming request
 * @param {Response}    res Outgoing response
 * @returns {Response}      A 200 status indicating API is healthy and running
 */
export const healthCheck = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Health']
   * #swagger.description = 'Returns a 200 (OK) status if API is reached.'
   */
  const flattenProjectProperties = (project: Project) => {
    const flattenedProperties = project.ProjectProperties.map((projectProperty) => {
      if (projectProperty.Building != null) {
        return {
          ...projectProperty.Building,
          Type: 'Building',
        };
      } else {
        return {
          ...projectProperty.Parcel,
          Type: 'Parcel',
        };
      }
    });
    return {
      ...project,
      Properties: flattenedProperties,
    };
  };
  const proj = 1044;
  const queryRunner = AppDataSource.createQueryRunner();
  const projectWithRelations = await queryRunner.manager.findOne(Project, {
    relations: {
      Agency: true,
      ProjectProperties: {
        Building: {
          Evaluations: true,
          Fiscals: true,
          Agency: true,
          BuildingPredominateUse: true,
        },
        Parcel: {
          Evaluations: true,
          Fiscals: true,
          Agency: true,
        },
      },
      AgencyResponses: true,
      Notes: true,
    },
    where: {
      Id: proj,
    },
  });
  const temp = nunjucks.renderString(
    "      <html>  <head>    <title>{{ Title }}</title>  </head>  <body>    <p>Good afternoon,</p>    <p>This email is to advise that the following properties have been submitted to the Surplus Property Program to be reviewed as surplus by the current holder of the property and is requesting your review:</p>    <p> Property Inventory Management System - <a href={{ Uri }}>{{ ProjectNumber }}</a>    </p>    <p>      <ol>        {% for property in Project.Properties %}            {% set assessed = property.Evaluations | filterByAttr('EvaluationKeyId', 0) | sort(false, false, 'Year') | last %}            {% set appraised = property.Evaluations | filterByAttr('EvaluationKeyId', 1) | sort(false, false, 'Year') | last %}          <li>             {% if property.Type == \"Parcel\" %}              <span>                 Site Address: {{ property.Address1 }}                <br>                 Site Description: {{ property.Name }}                <br>                 Site Size: {{ property.LandArea }} ha                <br>                 Zoned: {{ property.Zoning }}                <br>                 PID: {{ property.PID }}                <br>                 Legal: {{ property.LandLegalDescription }}                <br>                 Current Holder of the Property: {{ property.Agency.Name }}                <br>                {% if appraised != null and appraised.Value > 0 %}                  <span>                     Appraised Value: ${{ appraised.Value }} ({{ appraised.Year }} BC Assessment)                  </span>                 {% elif assessed != null and assessed.Value > 0 %}                   <span>                     Assessed Value: ${{ assessed.Value }} ({{ assessed.Year }})                   </span>                 {% endif %}              </span>             {% else %}                 <span>                   Site Address: {{ property.Address1 }}                  <br>                   Site Description: {{ property.Name }}                  <br>                   Rentable Area: {{ property.RentableArea }} Sq. M                  <br>                   Building Floors: {{ property.BuildingFloorCount }}                  <br>                   Predominate Use: {{ property.BuildingPredominateUse.Name }}                   <br>                   Tenancy: {{ property.BuildingTenancy }}                  <br>                   Current Holder of the Property: {{ property.Agency.Name }}                   <br>                   {% if appraised != null and appraised.Value > 0 %}                    <span>                       Appraised Value: ${{ appraised.Value }} ({{ appraised.Year }} BC Assessment)                    </span>                   {% elif assessed != null and assessed.Value > 0 %}                    <span>                       Assessed Value: ${{ assessed.Value }} ({{ assessed.Year }})                    </span>                   {% endif %}                </span >            {% endif %}          </li>        {% endfor %}      </ol>    </p>    <p> Thank you.</p>    <p> Strategic Real Estate Services, Real Property Division</p>  </body></html>      ",
    {
      Title: 'TITLE',
      Uri: process.env.FRONTEND_URL,
      ToAgency: 'a',
      Project: flattenProjectProperties(projectWithRelations),
    },
  );
  await queryRunner.release();
  return res.status(200).send(temp);
};
