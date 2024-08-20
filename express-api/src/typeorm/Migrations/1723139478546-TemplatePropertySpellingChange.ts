import { MigrationInterface, QueryRunner } from 'typeorm';

export class TemplatePropertySpellingChange1723139478546 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(
      `UPDATE "notification_template" SET subject = 'New Disposal Project Submitted - {{ Project.ProjectNumber }}', body = 
          '
          <html>
      <head>
        <title>{{ Title }}</title>
      </head>
      <body>
        <p>Good afternoon,</p>
        <p>This email is to advise that the following properties have been submitted to the Surplus Properties Program to be reviewed as surplus by the current holder of the property and is requesting your review:</p>
        <p> Property Inventory Management System - <a href="{{ Uri }}/projects/{{ Project.Id }}">{{ Project.ProjectNumber }}</a>
        </p>
        <p>
          <ol>
            {% for property in Project.Properties %}
                {% set assessed = property.Evaluations | filterByAttr(''EvaluationKeyId'', 0) | sort(false, false, ''Year'') | last %}
                {% set appraised = property.Evaluations | filterByAttr(''EvaluationKeyId'', 1) | sort(false, false, ''Year'') | last %}
              <li> 
                {% if property.Type == "Parcel" %}
                  <span> 
                    Site Address: {{ property.Address1 }}
                    <br> 
                    Site Description: {{ property.Name }}
                    <br> 
                    Site Size: {{ property.LandArea }} ha
                    <br> 
                    Zoned: {{ property.Zoning }}
                    <br> 
                    PID: {{ property.PID }}
                    <br> 
                    Legal: {{ property.LandLegalDescription }}
                    <br> 
                    Current Holder of the Property: {{ property.Agency.Name }}
                    <br>
                    {% if appraised != null and appraised.Value > 0 %}
                      <span> 
                        Appraised Value: \${{ appraised.Value }} ({{ appraised.Year }} BC Assessment)
                      </span> 
                    {% elif assessed != null and assessed.Value > 0 %} 
                      <span> 
                        Assessed Value: \${{ assessed.Value }} ({{ assessed.Year }}) 
                      </span> 
                    {% endif %}
                  </span> 
                {% else %} 
                    <span> 
                      Site Address: {{ property.Address1 }}
                      <br> 
                      Site Description: {{ property.Name }}
                      <br> 
                      Rentable Area: {{ property.RentableArea }} Sq. M
                      <br> 
                      Building Floors: {{ property.BuildingFloorCount }}
                      <br> 
                      Predominate Use: {{ property.BuildingPredominateUse.Name }} 
                      <br> 
                      Tenancy: {{ property.BuildingTenancy }}
                      <br> 
                      Current Holder of the Property: {{ property.Agency.Name }} 
                      <br> 
                      {% if appraised != null and appraised.Value > 0 %}
                        <span> 
                          Appraised Value: \${{ appraised.Value }} ({{ appraised.Year }} BC Assessment)
                        </span> 
                      {% elif assessed != null and assessed.Value > 0 %}
                        <span> 
                          Assessed Value: \${{ assessed.Value }} ({{ assessed.Year }})
                        </span> 
                      {% endif %}
                    </span >
                {% endif %}
              </li>
            {% endfor %}
          </ol>
        </p>
        <p> Thank you.</p>
        <p> Strategic Real Estate Services, Real Property Division</p>
      </body>
    </html>
          ' WHERE name = 'New Disposal Project Submitted';`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(
      `UPDATE "notification_template" SET subject = 'New Disposal Project Submitted - {{ Project.ProjectNumber }}', body = 
        '
        <html>
    <head>
      <title>{{ Title }}</title>
    </head>
    <body>
      <p>Good afternoon,</p>
      <p>This email is to advise that the following properties have been submitted to the Surplus Property Program to be reviewed as surplus by the current holder of the property and is requesting your review:</p>
      <p> Property Inventory Management System - <a href="{{ Uri }}/projects/{{ Project.Id }}">{{ Project.ProjectNumber }}</a>
      </p>
      <p>
        <ol>
          {% for property in Project.Properties %}
              {% set assessed = property.Evaluations | filterByAttr(''EvaluationKeyId'', 0) | sort(false, false, ''Year'') | last %}
              {% set appraised = property.Evaluations | filterByAttr(''EvaluationKeyId'', 1) | sort(false, false, ''Year'') | last %}
            <li> 
              {% if property.Type == "Parcel" %}
                <span> 
                  Site Address: {{ property.Address1 }}
                  <br> 
                  Site Description: {{ property.Name }}
                  <br> 
                  Site Size: {{ property.LandArea }} ha
                  <br> 
                  Zoned: {{ property.Zoning }}
                  <br> 
                  PID: {{ property.PID }}
                  <br> 
                  Legal: {{ property.LandLegalDescription }}
                  <br> 
                  Current Holder of the Property: {{ property.Agency.Name }}
                  <br>
                  {% if appraised != null and appraised.Value > 0 %}
                    <span> 
                      Appraised Value: \${{ appraised.Value }} ({{ appraised.Year }} BC Assessment)
                    </span> 
                  {% elif assessed != null and assessed.Value > 0 %} 
                    <span> 
                      Assessed Value: \${{ assessed.Value }} ({{ assessed.Year }}) 
                    </span> 
                  {% endif %}
                </span> 
              {% else %} 
                  <span> 
                    Site Address: {{ property.Address1 }}
                    <br> 
                    Site Description: {{ property.Name }}
                    <br> 
                    Rentable Area: {{ property.RentableArea }} Sq. M
                    <br> 
                    Building Floors: {{ property.BuildingFloorCount }}
                    <br> 
                    Predominate Use: {{ property.BuildingPredominateUse.Name }} 
                    <br> 
                    Tenancy: {{ property.BuildingTenancy }}
                    <br> 
                    Current Holder of the Property: {{ property.Agency.Name }} 
                    <br> 
                    {% if appraised != null and appraised.Value > 0 %}
                      <span> 
                        Appraised Value: \${{ appraised.Value }} ({{ appraised.Year }} BC Assessment)
                      </span> 
                    {% elif assessed != null and assessed.Value > 0 %}
                      <span> 
                        Assessed Value: \${{ assessed.Value }} ({{ assessed.Year }})
                      </span> 
                    {% endif %}
                  </span >
              {% endif %}
            </li>
          {% endfor %}
        </ol>
      </p>
      <p> Thank you.</p>
      <p> Strategic Real Estate Services, Real Property Division</p>
    </body>
  </html>
        ' WHERE name = 'New Disposal Project Submitted';`,
    );
  }
}
