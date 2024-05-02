import { MigrationInterface, QueryRunner } from 'typeorm';

export class TemplatesConvertedToNunjucks1714520695197 implements MigrationInterface {
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
    <p>This email is to advise that the following properties have been submitted to the Surplus Property Program to be reviewed as surplus by the current holder of the property and is requesting your review:</p>
    <p> Property Inventory Management System - <a href={{ Uri }}>{{ ProjectNumber }}</a>
    </p>
    <p>
      <ol>
        {% for property in Project.Properties %}
            {% set assessed = property.Evaluations | filterByAttr(''EvaluationKeyId'', 0) | sort(false, false, ''Date'') | first %}
            {% set appraised = property.Evaluations | filterByAttr(''EvaluationKeyId'', 1) | sort(false, false, ''Date'') | first %}
          <li> 
            {% if property.Type == "Parcel" %}
              <span> 
                Site Address: {{ property.Address1 }}
                <br> 
                Site Description: {{ property.Name }}
                <br> 
                Site Size: {{ property.TotalArea }} ha
                <br> 
                Zoned: {{ property.Zoning }}
                <br> 
                PID: {{ property.PID }}
                <br> 
                Legal: {{ property.LegalDescription }}
                <br> 
                Current Holder of the Property: {{ property.Agency.Name }}
                <br>
                {% if appraised != null and appraised.Value > 0 %}
                  <span> 
                    Appraised Value: \${{ appraised.Value }} ({{ appraised.Date.getFullYear() }} BC Assessment)
                  </span> 
                {% elif assessed != null and assessed.Value > 0 %} 
                  <span> 
                    Assessed Value: \${{ assessed.Value }} ({{ assessed.Date.getFullYear() }}) 
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
                  Predominate Use: {{ property.BuildingPredominateUse?.Name }} 
                  <br> 
                  Tenancy: {{ property.BuildingTenancy }}
                  <br> 
                  Current Holder of the Property: {{ property.Agency?.Name }} 
                  <br> 
                  {% if appraised != null and appraised.Value > 0 %}
                    <span> 
                      Appraised Value: \${{ appraised.Value }} ({{ appraised.Date.getFullYear() }} BC Assessment)
                    </span> 
                  {% elif assessed != null and assessed.Value > 0 %}
                    <span> 
                      Assessed Value: \${{ assessed.Value }} ({{ assessed.Date.getFullYear() }})
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
    queryRunner.query(
      `UPDATE notification_template SET subject = 'Disposal Project Denied - {{ ProjectNumber }}', body = ' <html> 
        <head>
            <title>{{ Title }}</title>
        </head> 
        <body> 
            <p>Good morning / Good afternoon,</p>
            <p>Your project {{ Project.ProjectNumber }} has been denied. Signin to <a href={{ Uri }}>PIMS</a> to review the reason.</p>
            <p>Sincerely Real Property Division</p> 
        </body>
    </html>' WHERE name = 'Disposal Project Denied';`,
    );
    queryRunner.query(
      `UPDATE notification_template SET subject = 'Disposal Project Cancelled - {{ ProjectNumber }}', body = ' <html>
        <head>
            <title>{{ Title }}</title>
        </head> 
        <body> 
            <p>Good morning / Good afternoon,</p>
            <p>Your project {{ Project.PropertyNumber }} has been cancelled. Signin to <a href={{ Uri }}>PIMS</a> to review the reason.</p>
            <p>Sincerely Real Property Division</p> 
        </body> 
    </html>' WHERE name = 'Disposal Project Cancelled';`,
    );
    queryRunner.query(
      `UPDATE notification_template SET subject = 'Disposal Project Approved for ERP - {{ ProjectNumber }}', body = ' <html> 
        <head>
            <title>{{ Title }}</title>
        </head> 
        <body>
            {% set note = Project.Notes | filterByAttr(''NoteType'', 22) | first %}
            {# 22 -> ErpNotification #}
            <p>Good morning / Good afternoon,</p>
            <p>Your project {{ Project.ProjectNumber }} has been approved. Signin to <a href={{ Uri }}>PIMS</a> to review the progress.</p>
            <p>{{ note.Note }}</p>
            <p>Sincerely Real Property Division</p>
        </body>
    </html>' WHERE name = 'Disposal Project Approved for ERP';`,
    );
    queryRunner.query(
      `UPDATE notification_template SET body = '<html>
        <head>
            <title>{{ Title }}</title>
        </head>
        <body>
            <p>{{ ToAgency.AddressTo if ToAgency.AddressTo else "Good morning / Good afternoon" }},</p>
            <p>As detailed in the <a href="https://intranet.gov.bc.ca/assets/intranet/mtics/real-property/who-we-are/branch-sres/process_manual_for_the_surplus_properties_program_-_feb_2020_-_version_2.pdf">Surplus Properties Program Process Manual</a>, the Strategic Real Estate Services Branch (SRES) has committed to proactively notifying all other Ministries, SUCH Sector Organization and Broader Public Sector (BPS) Entities of the availability of a new surplus property.</p>
            <p><b>Please forward this notification to any SUCH Sector Organization or BPS Entity that your ministry is responsible for to ensure any interest from Ministries or Agencies in the properties is identified.</b></p>
            <p><b>Should there be no interest in the property detailed below from your Ministry or any SUCH Sector Organization or BPS Entity that your Ministry is responsible for, please respond to confirm. </b></p>
            <p>This email is to advise that the following property has been identified as surplus by the current holder of the property and is available for redeployment if there is a need by your Ministry, SUCH Sector Organization or BPS Entity:</p>
            <p><b>{{ Project.ProjectNumber }}:</b></p>
            <p>
                <ol>
                    {% for property in Project.Properties %}
                        <li>
                            {% if property.PropertyType == PropertyTypes.Land %}
                                <span>
                                    Site Address: {{ property.Address1 }}<br>
                                    Site Description: {{ property.Name }}<br>
                                    Site Size: {{ property.LandArea }} ha<br>
                                    Zoned: {{ property.Zoning }}<br>
                                    PID: {{ property.PID }} <br>
                                    Legal: {{ property.LandLegalDescription }}<br>
                                    Current Holder of the Property: {{ property.Agency?.Name }} <br>
                                    {% if Project.Appraised != null and Project.Appraised.Value > 0 %}
                                        <span>Appraised Value: \${{ Project.Appraised.Value }}</span>
                                    {% elif Project.Assessed != null and Project.Assessed.Value > 0 %}
                                        <span>Assessed Value: \${{ Project.Assessed.Value }}</span>
                                    {% endif %}
                                </span>
                            {% else %}
                                <span>
                                    Site Address: {{ property.Address1 }}<br>
                                    Site Description: {{ property.Name }}<br>
                                    Rentable Area: {{ property.RentableArea }} Sq. M<br>
                                    Building Floors: {{ property.BuildingFloorCount }} <br>
                                    Predominate Use: {{ property.BuildingPredominateUse?.Name }}<br>
                                    Tenancy: {{ property.BuildingTenancy }}<br>
                                    Current Holder of the Property: {{ property.Agency?.Name }} <br>
                                    {% if Project.Appraised != null and Project.Appraised.Value > 0 %}
                                        <span>Appraised Value: \${{ Project.Appraised.Value }}</span>
                                    {% elif Project.Assessed != null and Project.Assessed.Value > 0 %}
                                        <span>Assessed Value: \${{ Project.Assessed.Value }}</span>
                                    {% endif %}
                                </span>
                            {% endif %}
                        </li>
                    {% endfor %}
                </ol>
            </p>
            {% set note = Project.Notes | filterByAttr(''NoteType'', 22) | first %}
            <p>Your Ministry, SUCH Sector Organization or BPS Entity is provided with 90 days from this notification to submit a Business Case to SRES expressing your interest in acquiring the surplus property. Reminder notifications will be sent at both 30 days and 60 days from this initial notification.</p>
            <p>{{ note.Note }}</p>
            <p>If you have any questions regarding this matter, please contact Chris Seltenrich Executive Director of the Strategic Real Estate Services Branch at 778-698-3195.</p>
            <p>Thank you.</p>
            <p>Strategic Real Estate Services, Real Property Division</p>
        </body>
        </html>
        ' WHERE name = 'New Properties on ERP';`,
    );
    queryRunner.query(
      `UPDATE notification_template SET body = '<html>
        <head>
            <title>{{ Title }}</title>
        </head>
        <body>
            <p>{{ ToAgency.AddressTo if ToAgency.AddressTo else "Good morning / Good afternoon" }}</p>
            <p>This email is a 30 Day Reminder Notification as detailed in the initial Notification of Surplus Real Property below.</p>
            <p>As detailed in the <a href="https://intranet.gov.bc.ca/assets/intranet/mtics/real-property/who-we-are/branch-sres/process_manual_for_the_surplus_properties_program_-_feb_2020_-_version_2.pdf">Surplus Properties Program Process Manual</a>, the Strategic Real Estate Services Branch (SRES) has committed to proactively notifying all other Ministries, SUCH Sector Organization and Broader Public Sector (BPS) Entities of the availability of a new surplus property.</p>
            <p>This email is to advise that the following property have been identified as surplus is available for redeployment:</p>
            <p><b>{{ Project.ProjectNumber }}:</b></p>
            <p>
                <ol>
                    {% for property in Project.Properties %}
                        <li>
                            {% if property.PropertyType == PropertyTypes.Land %}
                                <span>
                                    Site Address: {{ property.Address1 }}<br>
                                    Site Description: {{ property.Name }}<br>
                                    Site Size: {{ property.LandArea }} ha<br>
                                    Zoned: {{ property.Zoning }}<br>
                                    PID: {{ property.PID }} <br>
                                    Legal: {{ property.LandLegalDescription }}<br>
                                    Current Holder of the Property: {{ property.Agency?.Name }} <br>
                                    {% if Project.Appraised != null and Project.Appraised.Value > 0 %}
                                        <span>Appraised Value: \${{ Project.Appraised.Value }}</span>
                                    {% elif Project.Assessed != null and Project.Assessed.Value > 0 %}
                                        <span>Assessed Value: \${{ Project.Assessed.Value }}</span>
                                    {% endif %}
                                </span>
                            {% else %}
                                <span>
                                    Site Address: {{ property.Address1 }}<br>
                                    Site Description: {{ property.Name }}<br>
                                    Rentable Area: {{ property.RentableArea }} Sq. M<br>
                                    Building Floors: {{ property.BuildingFloorCount }} <br>
                                    Predominate Use: {{ property.BuildingPredominateUse?.Name }}<br>
                                    Tenancy: {{ property.BuildingTenancy }}<br>
                                    Current Holder of the Property: {{ property.Agency?.Name }} <br>
                                    {% if Project.Appraised != null and Project.Appraised.Value > 0 %}
                                        <span>Appraised Value: \${{ Project.Appraised.Value }}</span>
                                    {% elif Project.Assessed != null and Project.Assessed.Value > 0 %}
                                        <span>Assessed Value: \${{ Project.Assessed.Value }}</span>
                                    {% endif %}
                                </span>
                            {% endif %}
                        </li>
                    {% endfor %}
                </ol>
            </p>
            {% set note = Project.Notes | filterByAttr(''NoteType'', 22) | first %}
            <p>{{ note.Note }}</p>
            <p>If you have any questions regarding this matter, please contact Chris Seltenrich Executive Director of the Strategic Real Estate Services Branch at 778-698-3195.</p>
            <p>Thank you.</p>
            <p>Strategic Real Estate Services, Real Property Division</p>
        </body>
        </html>
        ' WHERE name = '30 day ERP notification - Owning Agency';`,
    );
    queryRunner.query(
      `UPDATE notification_template SET  body = '<html>
        <head>
            <title>{{ Title }}</title>
        </head>
        <body>
            <p>{{ ToAgency.AddressTo if ToAgency.AddressTo else "Good morning / Good afternoon"}},</p>
            <p>This email is a 60 Day Reminder Notification as detailed in the initial Notification of Surplus Real Property below.</p>
            <p>As detailed in the <a href="https://intranet.gov.bc.ca/assets/intranet/mtics/real-property/who-we-are/branch-sres/process_manual_for_the_surplus_properties_program_-_feb_2020_-_version_2.pdf">Surplus Properties Program Process Manual</a>, the Strategic Real Estate Services Branch (SRES) has committed to proactively notifying all other Ministries, SUCH Sector Organization and Broader Public Sector (BPS) Entities of the availability of a new surplus property.</p>
            <p>This email is to advise that the following property have been identified as surplus is available for redeployment:</p>
            <p><b>{{ Project.ProjectNumber }}:</b></p>
            <p>
                <ol>
                    {% for property in Project.Properties %}
                        <li>
                            {% if property.PropertyType == PropertyTypes.Land %}
                                <span>
                                    Site Address: {{ property.Address1 }}<br>
                                    Site Description: {{ property.Name }}<br>
                                    Site Size: {{ property.LandArea }} ha<br>
                                    Zoned: {{ property.Zoning }}<br>
                                    PID: {{ property.PID }} <br>
                                    Legal: {{ property.LandLegalDescription }}<br>
                                    Current Holder of the Property: {{ property.Agency?.Name }} <br>
                                    {% if Project.Appraised != null and Project.Appraised.Value > 0 %}
                                        <span>Appraised Value: \${{ Project.Appraised.Value }}</span>
                                    {% elif Project.Assessed != null and Project.Assessed.Value > 0 %}
                                        <span>Assessed Value: \${{ Project.Assessed.Value }}</span>
                                    {% endif %}
                                </span>
                            {% else %}
                                <span>
                                    Site Address: {{ property.Address1 }}<br>
                                    Site Description: {{ property.Name }}<br>
                                    Rentable Area: {{ property.RentableArea }} Sq. M<br>
                                    Building Floors: {{ property.BuildingFloorCount }} <br>
                                    Predominate Use: {{ property.BuildingPredominateUse?.Name }}<br>
                                    Tenancy: {{ property.BuildingTenancy }}<br>
                                    Current Holder of the Property: {{ property.Agency?.Name }} <br>
                                    {% if Project.Appraised != null and Project.Appraised.Value > 0 %}
                                        <span>Appraised Value: \${{ Project.Appraised.Value }}</span>
                                    {% elif Project.Assessed != null and Project.Assessed.Value > 0 %}
                                        <span>Assessed Value: \${{ Project.Assessed.Value }}</span>
                                    {% endif %}
                                </span>
                            {% endif %}
                        </li>
                    {% endfor %}
                </ol>
            </p>
            {% set note = Project.Notes | filterByAttr(''NoteType'', 22) | first %}
            <p>{{ note.Note }}</p>
            <p>If you have any questions regarding this matter, please contact Chris Seltenrich Executive Director of the Strategic Real Estate Services Branch at 778-698-3195.</p>
            <p>Thank you.</p>
            <p>Strategic Real Estate Services, Real Property Division</p>
        </body>
        </html>
        ' WHERE name = '60 day ERP notification - Owning Agency';`,
    );
    queryRunner.query(
      `UPDATE notification_template SET body = '<html>
        <head>
            <title>{{ Title }}</title>
        </head>
        <body>
            <p>{{ ToAgency.AddressTo if ToAgency.AddressTo else  "Good morning / Good afternoon" }},</p>
            <p>This email is a 90 Day Completion Reminder Notification as detailed in the initial Notification of Surplus Real Property below.</p>
            <p>As detailed in the <a href="https://intranet.gov.bc.ca/assets/intranet/mtics/real-property/who-we-are/branch-sres/process_manual_for_the_surplus_properties_program_-_feb_2020_-_version_2.pdf">Surplus Properties Program Process Manual</a>, the Strategic Real Estate Services Branch (SRES) has committed to proactively notifying all other Ministries, SUCH Sector Organization and Broader Public Sector (BPS) Entities of the availability of a new surplus property.</p>
            <p>This email is to advise that the following property have been identified as surplus is available for redeployment:</p>
            <p><b>{{ Project.ProjectNumber }}:</b></p>
            <p>
                <ol>
                    {% for property in Project.Properties %}
                        <li>
                            {% if property.PropertyType == PropertyTypes.Land %}
                                <span>
                                    Site Address: {{ property.Address1 }}<br>
                                    Site Description: {{ property.Name }}<br>
                                    Site Size: {{ property.LandArea }} ha<br>
                                    Zoned: {{ property.Zoning }}<br>
                                    PID: {{ property.PID }} <br>
                                    Legal: {{ property.LandLegalDescription }}<br>
                                    Current Holder of the Property: {{ property.Agency?.Name }} <br>
                                    {% if Project.Appraised != null and Project.Appraised.Value > 0 %}
                                        <span>Appraised Value: \${{ Project.Appraised.Value }}</span>
                                    {% elif Project.Assessed != null and Project.Assessed.Value > 0 %}
                                        <span>Assessed Value: \${{ Project.Assessed.Value }}</span>
                                    {% endif %}
                                </span>
                            {% else %}
                                <span>
                                    Site Address: {{ property.Address1 }}<br>
                                    Site Description: {{ property.Name }}<br>
                                    Rentable Area: {{ property.RentableArea }} Sq. M<br>
                                    Building Floors: {{ property.BuildingFloorCount }} <br>
                                    Predominate Use: {{ property.BuildingPredominateUse?.Name }}<br>
                                    Tenancy: {{ property.BuildingTenancy }}<br>
                                    Current Holder of the Property: {{ property.Agency?.Name }} <br>
                                    {% if Project.Appraised != null and Project.Appraised.Value > 0 %}
                                        <span>Appraised Value: \${{ Project.Appraised.Value }}</span>
                                    {% elif Project.Assessed != null and Project.Assessed.Value > 0 %}
                                        <span>Assessed Value: \${{ Project.Assessed.Value }}</span>
                                    {% endif %}
                                </span>
                            {% endif %}
                        </li>
                    {% endfor %}
                </ol>
            </p>
            {% set note = Project.Notes | filterByAttr(''NoteType'', 22) | first %}
            <p>{{ note.Note }}</p>
            <p>If you have any questions regarding this matter, please contact Chris Seltenrich Executive Director of the Strategic Real Estate Services Branch at 778-698-3195.</p>
            <p>Thank you.</p>
            <p>Strategic Real Estate Services, Real Property Division</p>
        </body>
        </html>
        ' WHERE name = '90 day ERP notification - Owning Agency';`,
    );
    queryRunner.query(
      `UPDATE notification_template SET body = '<html>
        <head>
            <title>{{ Title }}</title>
        </head>
        <body>
            <p>{{ ToAgency.AddressTo if ToAgency.AddressTo else "Good morning / Good afternoon" }},</p>
            <p>This email is a 30 Day Reminder Notification as detailed in the initial Notification of Surplus Real Property below.</p>
            <p>As detailed in the <a href="https://intranet.gov.bc.ca/assets/intranet/mtics/real-property/who-we-are/branch-sres/process_manual_for_the_surplus_properties_program_-_feb_2020_-_version_2.pdf">Surplus Properties Program Process Manual</a>, the Strategic Real Estate Services Branch (SRES) has committed to proactively notifying all other Ministries, SUCH Sector Organization and Broader Public Sector (BPS) Entities of the availability of a new surplus property.</p>
            <p><b>Please forward this notification to any SUCH Sector Organization or BPS Entity that your ministry is responsible for to ensure any interest from Ministries or Agencies in the properties is identified.</b></p>
            <p><b>Should there be no interest in the property detailed below from your Ministry or any SUCH Sector Organization or BPS Entity that your Ministry is responsible for, please respond to confirm. </b></p>
            <p>This email is to advise that the following property has been identified as surplus by the current holder of the property and is available for redeployment if there is a need by your Ministry, SUCH Sector Organization or BPS Entity:</p>
            <p><b>{{ Project.ProjectNumber }}:</b></p>
            <p>
                <ol>
                    {% for property in Project.Properties %}
                        <li>
                            {% if property.PropertyType == PropertyTypes.Land %}
                                <span>
                                    Site Address: {{ property.Address1 }}<br>
                                    Site Description: {{ property.Name }}<br>
                                    Site Size: {{ property.LandArea }} ha<br>
                                    Zoned: {{ property.Zoning }}<br>
                                    PID: {{ property.PID }} <br>
                                    Legal: {{ property.LandLegalDescription }}<br>
                                    Current Holder of the Property: {{ property.Agency?.Name }} <br>
                                    {% if Project.Appraised != null and Project.Appraised.Value > 0 %}
                                        <span>Appraised Value: \${{ Project.Appraised.Value }}</span>
                                    {% elif Project.Assessed != null and Project.Assessed.Value > 0 %}
                                        <span>Assessed Value: \${{ Project.Assessed.Value }}</span>
                                    {% endif %}
                                </span>
                            {% else %}
                                <span>
                                    Site Address: {{ property.Address1 }}<br>
                                    Site Description: {{ property.Name }}<br>
                                    Rentable Area: {{ property.RentableArea }} Sq. M<br>
                                    Building Floors: {{ property.BuildingFloorCount }} <br>
                                    Predominate Use: {{ property.BuildingPredominateUse?.Name }}<br>
                                    Tenancy: {{ property.BuildingTenancy }}<br>
                                    Current Holder of the Property: {{ property.Agency?.Name }} <br>
                                    {% if Project.Appraised != null and Project.Appraised.Value > 0 %}
                                        <span>Appraised Value: \${{ Project.Appraised.Value }}</span>
                                    {% elif Project.Assessed != null and Project.Assessed.Value > 0 %}
                                        <span>Assessed Value: \${{ Project.Assessed.Value }}</span>
                                    {% endif %}
                                </span>
                            {% endif %}
                        </li>
                    {% endfor %}
                </ol>
            </p>
            {% set note = Project.Notes | filterByAttr(''NoteType'', 22) | first %}
            <p>Your Ministry, SUCH Sector Organization or BPS Entity is provided with 60 days from this notification to submit a Business Case to SRES expressing your interest in acquiring the surplus property. An additional reminder notification will be sent 30 days before this internal listing expires.</p>
            <p>{{ note.Note }}</p>
            <p>If you have any questions regarding this matter, please contact Chris Seltenrich Executive Director of the Strategic Real Estate Services Branch at 778-698-3195.</p>
            <p>Thank you.</p>
        </body>
        </html>
        ' WHERE name = '30 day ERP notification - Parent Agencies';`,
    );
    queryRunner.query(
      `UPDATE notification_template SET body = '<html>
        <head>
            <title>{{ Title }}</title>
        </head>
        <body>
            <p>{{ ToAgency.AddressTo if ToAgency.AddressTo else "Good morning / Good afternoon" }},</p>
            <p>This email is a 60 Day Reminder Notification as detailed in the initial Notification of Surplus Real Property below.</p> <p>As detailed in the <a href=https://intranet.gov.bc.ca/assets/intranet/mtics/real-property/who-we-are/branch-sres/process_manual_for_the_surplus_properties_program_-_feb_2020_-_version_2.pdf>Surplus Properties Program Process Manual</a>, the Strategic Real Estate Services Branch (SRES) has committed to proactively notifying all other Ministries, SUCH Sector Organization and Broader Public Sector (BPS) Entities of the availability of a new surplus property.</p> 
            <p><b>Please forward this notification to any SUCH Sector Organization or BPS Entity that your ministry is responsible for to ensure any interest from Ministries or Agencies in the properties is identified.</b></p> 
            <p><b>Should there be no interest in the property detailed below from your Ministry or any SUCH Sector Organization or BPS Entity that your Ministry is responsible for, please respond to confirm. </b></p>
            <p>This email is to advise that the following property has been identified as surplus by the current holder of the property and is available for redeployment if there is a need by your Ministry, SUCH Sector Organization or BPS Entity:</p> 
            <p><b> {{ Project.ProjectNumber }} : </b></p>
            <p>
                <ol>
                    {% for property in Project.Properties %}
                        <li>
                            {% if property.PropertyType == PropertyTypes.Land %}
                                <span>
                                    Site Address: {{ property.Address1 }}<br>
                                    Site Description: {{ property.Name }}<br>
                                    Site Size: {{ property.LandArea }} ha<br>
                                    Zoned: {{ property.Zoning }}<br>
                                    PID: {{ property.PID }} <br>
                                    Legal: {{ property.LandLegalDescription }}<br>
                                    Current Holder of the Property: {{ property.Agency?.Name }} <br>
                                    {% if Project.Appraised != null and Project.Appraised.Value > 0 %}
                                        <span>Appraised Value: \${{ Project.Appraised.Value }}</span>
                                    {% elif Project.Assessed != null and Project.Assessed.Value > 0 %}
                                        <span>Assessed Value: \${{ Project.Assessed.Value }}</span>
                                    {% endif %}
                                </span>
                            {% else %}
                                <span>
                                    Site Address: {{ property.Address1 }}<br>
                                    Site Description: {{ property.Name }}<br>
                                    Rentable Area: {{ property.RentableArea }} Sq. M<br>
                                    Building Floors: {{ property.BuildingFloorCount }} <br>
                                    Predominate Use: {{ property.BuildingPredominateUse?.Name }}<br>
                                    Tenancy: {{ property.BuildingTenancy }}<br>
                                    Current Holder of the Property: {{ property.Agency?.Name }} <br>
                                    {% if Project.Appraised != null and Project.Appraised.Value > 0 %}
                                        <span>Appraised Value: \${{ Project.Appraised.Value }}</span>
                                    {% elif Project.Assessed != null and Project.Assessed.Value > 0 %}
                                        <span>Assessed Value: \${{ Project.Assessed.Value }}</span>
                                    {% endif %}
                                </span>
                            {% endif %}
                        </li>
                    {% endfor %}
                </ol>
            </p>
            {% set note = Project.Notes | filterByAttr(''NoteType'', 22) | first %}
            <p>Your Ministry, SUCH Sector Organization or BPS Entity is provided with 30 days from this notification to submit a Business Case to SRES expressing your interest in acquiring the surplus property.</p>
            <p>{{ note.Note }}</p>
            <p>If you have any questions regarding this matter, please contact Chris Seltenrich Executive Director of the Strategic Real Estate Services Branch at 778-698-3195.</p>
            <p>Thank you.</p>
        </body>
        </html>
        ' WHERE name = '60 day ERP notification - Parent Agencies';`,
    );
    queryRunner.query(
      `UPDATE notification_template SET body = '<html>
        <head>
            <title>{{ Title }}</title>
        </head>
        <body>
            <p>{{ ToAgency.AddressTo if ToAgency.AddressTo else "Good morning / Good afternoon" }},</p>
            <p>This email is to provide confirmation that the 90 Day Enhanced Referral Period as detailed in the initial Notification of Surplus Real Property below is now complete.</p> 
            <p><b>Please forward this notification to any SUCH Sector Organization or BPS Entity that your ministry is responsible for to ensure any interest from Ministries or Agencies in the properties is identified.</b></p> 
            <p><b>Should there be no interest in the property detailed below from your Ministry or any SUCH Sector Organization or BPS Entity that your Ministry is responsible for, please respond to confirm. </b></p>
            <p>This email is to advise that the following property has been identified as surplus by the current holder of the property and is available for redeployment if there is a need by your Ministry, SUCH Sector Organization or BPS Entity:</p> 
            <p><b> {{ Project.ProjectNumber }} : </b></p>
            <p>
                <ol>
                    {% for property in Project.Properties %}
                        <li>
                            {% if property.PropertyType == PropertyTypes.Land %}
                                <span>
                                    Site Address: {{ property.Address1 }}<br>
                                    Site Description: {{ property.Name }}<br>
                                    Site Size: {{ property.LandArea }} ha<br>
                                    Zoned: {{ property.Zoning }}<br>
                                    PID: {{ property.PID }} <br>
                                    Legal: {{ property.LandLegalDescription }}<br>
                                    Current Holder of the Property: {{ property.Agency?.Name }} <br>
                                    {% if Project.Appraised != null and Project.Appraised.Value > 0 %}
                                        <span>Appraised Value: \${{ Project.Appraised.Value }}</span>
                                    {% elif Project.Assessed != null and Project.Assessed.Value > 0 %}
                                        <span>Assessed Value: \${{ Project.Assessed.Value }}</span>
                                    {% endif %}
                                </span>
                            {% else %}
                                <span>
                                    Site Address: {{ property.Address1 }}<br>
                                    Site Description: {{ property.Name }}<br>
                                    Rentable Area: {{ property.RentableArea }} Sq. M<br>
                                    Building Floors: {{ property.BuildingFloorCount }} <br>
                                    Predominate Use: {{ property.BuildingPredominateUse?.Name }}<br>
                                    Tenancy: {{ property.BuildingTenancy }}<br>
                                    Current Holder of the Property: {{ property.Agency?.Name }} <br>
                                    {% if Project.Appraised != null and Project.Appraised.Value > 0 %}
                                        <span>Appraised Value: \${{ Project.Appraised.Value }}</span>
                                    {% elif Project.Assessed != null and Project.Assessed.Value > 0 %}
                                        <span>Assessed Value: \${{ Project.Assessed.Value }}</span>
                                    {% endif %}
                                </span>
                            {% endif %}
                        </li>
                    {% endfor %}
                </ol>
            </p>
            {% set note = Project.Notes | filterByAttr(''NoteType'', 22) | first %}
            <p>An Enhanced Referral Notification Letter will be sent to the owning Ministry / Agency at the end of the week advising of next steps in the process.</p>
            <p>{{ note.Note }}</p>
            <p>If you have any questions regarding this matter, please contact Chris Seltenrich Executive Director of the Strategic Real Estate Services Branch at 778-698-3195.</p>
            <p>Thank you.</p>
        </body>
        </html>
        ' WHERE name = '90 day ERP notification - Parent Agencies';`,
    );

    queryRunner.query(
      `UPDATE notification_template SET body = '<html>
        <head>
            <title>{{ Title }}</title>
        </head>
        <body>
           <p>{{ ToAgency.AddressTo if ToAgency.AddressTo else  "Good morning / Good afternoon" }},</p>
            <p>This email is a 30 Day Reminder Notification as detailed in the initial Notification of Surplus Real Property below.</p>
            <p>As detailed in the <a href="https://intranet.gov.bc.ca/assets/intranet/mtics/real-property/who-we-are/branch-sres/process_manual_for_the_surplus_properties_program_-_feb_2020_-_version_2.pdf">Surplus Properties Program Process Manual</a>, the Strategic Real Estate Services Branch (SRES) has committed to proactively notifying all other Ministries, SUCH Sector Organization and Broader Public Sector (BPS) Entities of the availability of a new surplus property.</p>
            <p>This email is to advise that the following property has been identified as surplus by the current holder of the property and is available for redeployment if there is a need by your Ministry, SUCH Sector Organization or BPS Entity:</p>
            <p><b>{{ Project.ProjectNumber }} :</b></p>
            <p>
                <ol>
                    {% for property in Project.Properties %}
                        <li>
                            {% if property.PropertyType == PropertyTypes.Land %}
                                <span>
                                    Site Address: {{ property.Address1 }}<br>
                                    Site Description: {{ property.Name }}<br>
                                    Site Size: {{ property.LandArea }} ha<br>
                                    Zoned: {{ property.Zoning }}<br>
                                    PID: {{ property.PID }} <br>
                                    Legal: {{ property.LandLegalDescription }}<br>
                                    Current Holder of the Property: {{ property.Agency?.Name }} <br>
                                    {% if Project.Appraised != null and Project.Appraised.Value > 0 %}
                                        <span>Appraised Value: \${{ Project.Appraised.Value }}</span>
                                    {% elif Project.Assessed != null and Project.Assessed.Value > 0 %}
                                        <span>Assessed Value: \${{ Project.Assessed.Value }}</span>
                                    {% endif %}
                                </span>
                            {% else %}
                                <span>
                                    Site Address: {{ property.Address1 }}<br>
                                    Site Description: {{ property.Name }}<br>
                                    Rentable Area: {{ property.RentableArea }} Sq. M<br>
                                    Building Floors: {{ property.BuildingFloorCount }} <br>
                                    Predominate Use: {{ property.BuildingPredominateUse?.Name }}<br>
                                    Tenancy: {{ property.BuildingTenancy }}<br>
                                    Current Holder of the Property: {{ property.Agency?.Name }} <br>
                                    {% if Project.Appraised != null and Project.Appraised.Value > 0 %}
                                        <span>Appraised Value: \${{ Project.Appraised.Value }}</span>
                                    {% elif Project.Assessed != null and Project.Assessed.Value > 0 %}
                                        <span>Assessed Value: \${{ Project.Assessed.Value }}</span>
                                    {% endif %}
                                </span>
                            {% endif %}
                        </li>
                    {% endfor %}
                </ol>
            </p>
            {% set note = Project.Notes | filterByAttr(''NoteType'', 22) | first %}
            <p>Your Ministry, SUCH Sector Organization or BPS Entity is provided with 60 days from this notification to submit a Business Case to SRES expressing your interest in acquiring the surplus property.</p>
            <p>{{ note.Note }}</p>
            <p>If you have any questions regarding this matter, please contact Chris Seltenrich Executive Director of the Strategic Real Estate Services Branch at 778-698-3195.</p>
            <p>Thank you.</p>
            <p>Strategic Real Estate Services, Real Property Division</p>
        </body>
        </html>
        ' WHERE name = '30 day ERP notification - Purchasing Agencies';`,
    );
    queryRunner.query(
      `UPDATE notification_template SET body = '<html>
        <head>
            <title>{{ Title }}</title>
        </head>
        <body>
           <p>{{ ToAgency.AddressTo if ToAgency.AddressTo else  "Good morning / Good afternoon" }},</p>
            <p>This email is a 60 Day Reminder Notification as detailed in the initial Notification of Surplus Real Property below.</p>
            <p>As detailed in the <a href="https://intranet.gov.bc.ca/assets/intranet/mtics/real-property/who-we-are/branch-sres/process_manual_for_the_surplus_properties_program_-_feb_2020_-_version_2.pdf">Surplus Properties Program Process Manual</a>, the Strategic Real Estate Services Branch (SRES) has committed to proactively notifying all other Ministries, SUCH Sector Organization and Broader Public Sector (BPS) Entities of the availability of a new surplus property.</p>
            <p>This email is to advise that the following property has been identified as surplus by the current holder of the property and is available for redeployment if there is a need by your Ministry, SUCH Sector Organization or BPS Entity:</p>
            <p><b>{{ Project.ProjectNumber }} :</b></p>
            <p>
                <ol>
                    {% for property in Project.Properties %}
                        <li>
                            {% if property.PropertyType == PropertyTypes.Land %}
                                <span>
                                    Site Address: {{ property.Address1 }}<br>
                                    Site Description: {{ property.Name }}<br>
                                    Site Size: {{ property.LandArea }} ha<br>
                                    Zoned: {{ property.Zoning }}<br>
                                    PID: {{ property.PID }} <br>
                                    Legal: {{ property.LandLegalDescription }}<br>
                                    Current Holder of the Property: {{ property.Agency?.Name }} <br>
                                    {% if Project.Appraised != null and Project.Appraised.Value > 0 %}
                                        <span>Appraised Value: \${{ Project.Appraised.Value }}</span>
                                    {% elif Project.Assessed != null and Project.Assessed.Value > 0 %}
                                        <span>Assessed Value: \${{ Project.Assessed.Value }}</span>
                                    {% endif %}
                                </span>
                            {% else %}
                                <span>
                                    Site Address: {{ property.Address1 }}<br>
                                    Site Description: {{ property.Name }}<br>
                                    Rentable Area: {{ property.RentableArea }} Sq. M<br>
                                    Building Floors: {{ property.BuildingFloorCount }} <br>
                                    Predominate Use: {{ property.BuildingPredominateUse?.Name }}<br>
                                    Tenancy: {{ property.BuildingTenancy }}<br>
                                    Current Holder of the Property: {{ property.Agency?.Name }} <br>
                                    {% if Project.Appraised != null and Project.Appraised.Value > 0 %}
                                        <span>Appraised Value: \${{ Project.Appraised.Value }}</span>
                                    {% elif Project.Assessed != null and Project.Assessed.Value > 0 %}
                                        <span>Assessed Value: \${{ Project.Assessed.Value }}</span>
                                    {% endif %}
                                </span>
                            {% endif %}
                        </li>
                    {% endfor %}
                </ol>
            </p>
            {% set note = Project.Notes | filterByAttr(''NoteType'', 22) | first %}
            <p>Your Ministry, SUCH Sector Organization or BPS Entity is provided with 30 days from this notification to submit a Business Case to SRES expressing your interest in acquiring the surplus property.</p> 
            <p>{{ note.Note }}</p>
            <p>If you have any questions regarding this matter, please contact Chris Seltenrich Executive Director of the Strategic Real Estate Services Branch at 778-698-3195.</p>
            <p>Thank you.</p>
            <p>Strategic Real Estate Services, Real Property Division</p>
        </body>
        </html>
        ' WHERE name = '60 day ERP notification - Purchasing Agencies';`,
    );
    queryRunner.query(
      `UPDATE notification_template SET body = '<html>
        <head>
            <title>{{ Title }}</title>
        </head>
        <body>
           <p>{{ ToAgency.AddressTo if ToAgency.AddressTo else  "Good morning / Good afternoon" }},</p>
            <p>This email is to provide confirmation that the 90 Day Enhanced Referral Period as detailed in the initial Notification of Surplus Real Property below is now complete.</p>
            <p>As detailed in the <a href="https://intranet.gov.bc.ca/assets/intranet/mtics/real-property/who-we-are/branch-sres/process_manual_for_the_surplus_properties_program_-_feb_2020_-_version_2.pdf">Surplus Properties Program Process Manual</a>, the Strategic Real Estate Services Branch (SRES) has committed to proactively notifying all other Ministries, SUCH Sector Organization and Broader Public Sector (BPS) Entities of the availability of a new surplus property.</p>
            <p>This email is to advise that the following property has been identified as surplus by the current holder of the property and is available for redeployment if there is a need by your Ministry, SUCH Sector Organization or BPS Entity:</p>
            <p><b>{{ Project.ProjectNumber }} :</b></p>
            <p>
                <ol>
                    {% for property in Project.Properties %}
                        <li>
                            {% if property.PropertyType == PropertyTypes.Land %}
                                <span>
                                    Site Address: {{ property.Address1 }}<br>
                                    Site Description: {{ property.Name }}<br>
                                    Site Size: {{ property.LandArea }} ha<br>
                                    Zoned: {{ property.Zoning }}<br>
                                    PID: {{ property.PID }} <br>
                                    Legal: {{ property.LandLegalDescription }}<br>
                                    Current Holder of the Property: {{ property.Agency?.Name }} <br>
                                    {% if Project.Appraised != null and Project.Appraised.Value > 0 %}
                                        <span>Appraised Value: \${{ Project.Appraised.Value }}</span>
                                    {% elif Project.Assessed != null and Project.Assessed.Value > 0 %}
                                        <span>Assessed Value: \${{ Project.Assessed.Value }}</span>
                                    {% endif %}
                                </span>
                            {% else %}
                                <span>
                                    Site Address: {{ property.Address1 }}<br>
                                    Site Description: {{ property.Name }}<br>
                                    Rentable Area: {{ property.RentableArea }} Sq. M<br>
                                    Building Floors: {{ property.BuildingFloorCount }} <br>
                                    Predominate Use: {{ property.BuildingPredominateUse?.Name }}<br>
                                    Tenancy: {{ property.BuildingTenancy }}<br>
                                    Current Holder of the Property: {{ property.Agency?.Name }} <br>
                                    {% if Project.Appraised != null and Project.Appraised.Value > 0 %}
                                        <span>Appraised Value: \${{ Project.Appraised.Value }}</span>
                                    {% elif Project.Assessed != null and Project.Assessed.Value > 0 %}
                                        <span>Assessed Value: \${{ Project.Assessed.Value }}</span>
                                    {% endif %}
                                </span>
                            {% endif %}
                        </li>
                    {% endfor %}
                </ol>
            </p>
            {% set note = Project.Notes | filterByAttr(''NoteType'', 22) | first %}
           <p>Your Ministry, SUCH Sector Organization or BPS Entity is provided with until the end of this week from this notification to submit a Business Case to SRES expressing your interest in acquiring the surplus property.</p> 
           <p>An Enhanced Referral Notification Letter will be sent to the owning Ministry / Agency at the end of the week advising of next steps in the process.</p>
            <p>{{ note.Note }}</p>
            <p>If you have any questions regarding this matter, please contact Chris Seltenrich Executive Director of the Strategic Real Estate Services Branch at 778-698-3195.</p>
            <p>Thank you.</p>
            <p>Strategic Real Estate Services, Real Property Division</p>
        </body>
        </html>
        ' WHERE name = '90 day ERP notification - Purchasing Agencies';`,
    );
    queryRunner.query(
      `UPDATE notification_template SET body = ' <html>
        <head>
            <title>{{ Title }}</title>
        </head> 
            <body>
                <p>Dear Administrator,</p>
                <p>{{ AccessRequest.FirstName }} {{ AccessRequest.LastName }} has submitted an access request to <a href={{ Uri }}>PIMS</a>.</p>
                <p>Signin and review their request.</p>
            </body>
    </html>' WHERE name = 'Access Request'; `,
    );
    queryRunner.query(
      `UPDATE notification_template SET subject = 'PIMS - Project Note Updated - {{ Project.ProjectNumber }}', body = '<html>
      <head>
          <title>{{ Title }}</title>
      </head> 
      <body>
          {# 1 -> Public #}
          {% set note = Project.Notes | filterByAttr(''NoteType'', 1) | first %}
          <p>Dear {{ Project.Manager if Project.Manager else "Property Manager" }},</p>
          <p>Your project {{ Project.ProjectNumber }} has been updated with the following note,</p>
          <p>{{ note.Note }}</p>
      </body>
  </html>' WHERE name = 'Project Shared Note Changed';`,
    );
    queryRunner.query(
      `UPDATE notification_template SET body = ' <html>
        <head>
            <title>{{ Title }}</title>
        </head>
        <body>
            <p>Dear Administrator,</p>
            <p>{{ AccessRequest.FirstName }} {{ AccessRequest.LastName }} has submitted an access request to <a href={{ Uri }}>PIMS</a>.</p>
            <p>Signin and review their request.</p>
        </body>
    </html>' WHERE name = 'Access Request RPD Mailbox';`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(
      `UPDATE notification_template SET subject = 'New Disposal Project Submitted - @Model.Project.ProjectNumber', body = ' @using System.Linq @using Pims.Dal.Entities @using System.Globalization <html><head><title>@Model.Environment.Title</title></head><body> <p>Good afternoon,</p> <p>This email is to advise that the following properties have been submitted to the Surplus Property Program to be reviewed as surplus by the current holder of the property and is requesting your review:</p> <p>Property Inventory Management System - <a href=@Model.Environment.Uri>@Model.Project.ProjectNumber</a></p> <p> <ol> @foreach (var property in Model.Project.Properties) { <li> @if (property.PropertyType == PropertyTypes.Land) { var appraised = property.Parcel.Evaluations.OrderByDescending(e => e.Date).FirstOrDefault(e => e.Key == EvaluationKeys.Appraised),var assessed = property.Parcel.Evaluations.OrderByDescending(e => e.Date).FirstOrDefault(e => e.Key == EvaluationKeys.Assessed),<span> Site Address: @property.Parcel.Address.ToString()<br> Site Description: @property.Parcel.Name<br> Site Size: @property.Parcel.LandArea ha<br> Zoned: @property.Parcel.Zoning<br> PID: @property.Parcel.ParcelIdentity<br> Legal: @property.Parcel.LandLegalDescription<br> Current Holder of the Property: @property.Parcel.Agency?.Name<br> @if (appraised != null && appraised.Value > 0) { <span>Appraised Value: @appraised.Value.ToString(C, new CultureInfo(en-US)) (@appraised.Date.Year BC Assessment)</span> } else if (assessed != null && assessed.Value > 0) { <span>Assessed Value: @assessed.Value.ToString(C, new CultureInfo(en-US)) (@assessed.Date.Year)</span> } </span> } else { var appraised = property.Building.Evaluations.OrderByDescending(e => e.Date).FirstOrDefault(e => e.Key == EvaluationKeys.Appraised),var assessed = property.Building.Evaluations.OrderByDescending(e => e.Date).FirstOrDefault(e => e.Key == EvaluationKeys.Assessed),<span> Site Address: @property.Building.Address.ToString()<br> Site Description: @property.Building.Name<br> Rentable Area: @property.Building.RentableArea Sq. M<br> Building Floors: @property.Building.BuildingFloorCount<br> Predominate Use: @property.Building.BuildingPredominateUse?.Name<br> Tenancy: @property.Building.BuildingTenancy<br> Current Holder of the Property: @property.Building.Agency?.Name<br> @if (appraised != null && appraised.Value > 0) { <span>Appraised Value: @appraised.Value.ToString(C, new CultureInfo(en-US)) (@appraised.Date.Year BC Assessment)</span> } else if (assessed != null && assessed.Value > 0) { <span>Assessed Value: @assessed.Value.ToString(C, new CultureInfo(en-US)) (@assessed.Date.Year)</span> } </span> } </li> } </ol> </p> <p>Thank you.</p> <p>Strategic Real Estate Services, Real Property Division</p></body></html>' WHERE name = 'New Disposal Project Submitted'`,
    );
    queryRunner.query(
      `UPDATE notification_template SET subject = 'Disposal Project Denied - @Model.Project.ProjectNumber', body = ' <html> <head><title>@Model.Environment.Title</title></head> <body> <p>Good morning / Good afternoon,</p> <p>Your project @Model.Project.ProjectNumber has been denied. Signin to <a href=@Model.Environment.Uri>PIMS</a> to review the reason.</p> <p>Sincerely Real Property Division</p> </body> </html>' WHERE name = 'Disposal Project Denied';`,
    );
    queryRunner.query(
      `UPDATE notification_template SET subject = 'Disposal Project Cancelled - @Model.Project.ProjectNumber', body = ' <html><head><title>@Model.Environment.Title</title></head> <body> <p>Good morning / Good afternoon,</p> <p>Your project @Model.Project.ProjectNumber has been cancelled. Signin to <a href=@Model.Environment.Uri>PIMS</a> to review the reason.</p> <p>Sincerely Real Property Division</p> </body> </html>' WHERE name = 'Disposal Project Cancelled';`,
    );
    queryRunner.query(
      `UPDATE notification_template SET subject = 'Disposal Project Approved for ERP - @Model.Project.ProjectNumber', body = ' @using System.Linq @using Pims.Dal.Entities <html> <head><title>@Model.Environment.Title</title></head> <body> <p>Good morning / Good afternoon,</p> <p>Your project @Model.Project.ProjectNumber has been approved. Signin to <a href=@Model.Environment.Uri>PIMS</a> to review the progress.</p> <p>@Model.Project.Notes.FirstOrDefault(n => n.NoteType == NoteTypes.ErpNotification)?.Note</p><p>Sincerely Real Property Division</p> </body> </html>' WHERE name = 'Disposal Project Approved for ERP';`,
    );
    queryRunner.query(
      `UPDATE notification_template SET body = ' @using System.Linq @using Pims.Dal.Entities @using System.Globalization <html><head><title>@Model.Environment.Title</title></head><body> <p>@(Model.ToAgency.AddressTo ?? Good morning / Good afternoon),</p> <p>As detailed in the <a href=https://intranet.gov.bc.ca/assets/intranet/mtics/real-property/who-we-are/branch-sres/process_manual_for_the_surplus_properties_program_-_feb_2020_-_version_2.pdf>Surplus Properties Program Process Manual</a>, the Strategic Real Estate Services Branch (SRES) has committed to proactively notifying all other Ministries, SUCH Sector Organization and Broader Public Sector (BPS) Entities of the availability of a new surplus property.</p> <p><b>Please forward this notification to any SUCH Sector Organization or BPS Entity that your ministry is responsible for to ensure any interest from Ministries or Agencies in the properties is identified.</b></p> <p><b>Should there be no interest in the property detailed below from your Ministry or any SUCH Sector Organization or BPS Entity that your Ministry is responsible for, please respond to confirm. </b></p> <p>This email is to advise that the following property has been identified as surplus by the current holder of the property and is available for redeployment if there is a need by your Ministry, SUCH Sector Organization or BPS Entity:</p> <p><b> @Model.Project.ProjectNumber : </b></p> <p> <ol> @foreach (var property in Model.Project.Properties) { <li> @if (property.PropertyType == PropertyTypes.Land) { var appraised = @Model.Project.Appraised,var assessed = @Model.Project.Assessed,<span> Site Address: @property.Parcel.Address.ToString()<br> Site Description: @property.Parcel.Name<br> Site Size: @property.Parcel.LandArea ha<br> Zoned: @property.Parcel.Zoning<br> PID: @property.Parcel.ParcelIdentity<br> Legal: @property.Parcel.LandLegalDescription<br> Current Holder of the Property: @property.Parcel.Agency.Name<br> @if (appraised != null && appraised.Value > 0) { <span>Appraised Value: @appraised.Value.ToString(C, new CultureInfo(en-US))</span> } else if (assessed != null && assessed.Value > 0) { <span>Assessed Value: @assessed.Value.ToString(C, new CultureInfo(en-US))</span> } </span> } else { var appraised = @Model.Project.Appraised,var assessed = @Model.Project.Assessed,<span> Site Address: @property.Building.Address.ToString()<br> Site Description: @property.Building.Name<br> Rentable Area: @property.Building.RentableArea Sq. M<br> Building Floors: @property.Building.BuildingFloorCount<br> Predominate Use: @property.Building.BuildingPredominateUse.Name<br> Tenancy: @property.Building.BuildingTenancy<br> Current Holder of the Property: @property.Building.Agency.Name<br> @if (appraised != null && appraised.Value > 0) { <span>Appraised Value: @appraised.Value.ToString(C, new CultureInfo(en-US))</span> } else if (assessed != null && assessed.Value > 0) { <span>Assessed Value: @assessed.Value.ToString(C, new CultureInfo(en-US))</span> } </span> } </li> } </ol> </p> <p>Your Ministry, SUCH Sector Organization or BPS Entity is provided with 90 days from this notification to submit a Business Case to SRES expressing your interest in acquiring the surplus property. Reminder notifications will be sent at both 30 days and 60 days from this initial notification.</p> <p>@Model.Project.Notes.FirstOrDefault(n => n.NoteType == NoteTypes.ErpNotification)?.Note</p> <p>If you have any questions regarding this matter, please contact Chris Seltenrich Executive Director of the Strategic Real Estate Services Branch at 778-698-3195.</p> <p>Thank you.</p> <p>Strategic Real Estate Services, Real Property Division</p></body></html>' WHERE name = 'New Properties on ERP';`,
    );
    queryRunner.query(
      `UPDATE notification_template SET body = ' @using System.Linq @using Pims.Dal.Entities @using System.Globalization <html><head><title>@Model.Environment.Title</title></head><body> <p>@(Model.ToAgency.AddressTo ?? Good morning / Good afternoon),</p> <p>This email is a 30 Day Reminder Notification as detailed in the initial Notification of Surplus Real Property below.</p> <p>As detailed in the <a href=https://intranet.gov.bc.ca/assets/intranet/mtics/real-property/who-we-are/branch-sres/process_manual_for_the_surplus_properties_program_-_feb_2020_-_version_2.pdf>Surplus Properties Program Process Manual</a>, the Strategic Real Estate Services Branch (SRES) has committed to proactively notifying all other Ministries, SUCH Sector Organization and Broader Public Sector (BPS) Entities of the availability of a new surplus property.</p> <p>This email is to advise that the following property have been identified as surplus is available for redeployment:</p> <p><b> @Model.Project.ProjectNumber : </b></p> <p> <ol> @foreach (var property in Model.Project.Properties) { <li> @if (property.PropertyType == PropertyTypes.Land) { var appraised = @Model.Project.Appraised,var assessed = @Model.Project.Assessed,<span> Site Address: @property.Parcel.Address.ToString()<br> Site Description: @property.Parcel.Name<br> Site Size: @property.Parcel.LandArea ha<br> Zoned: @property.Parcel.Zoning<br> PID: @property.Parcel.ParcelIdentity<br> Legal: @property.Parcel.LandLegalDescription<br> Current Holder of the Property: @property.Parcel.Agency.Name<br> @if (appraised != null && appraised.Value > 0) { <span>Appraised Value: @appraised.Value.ToString(C, new CultureInfo(en-US))</span> } else if (assessed != null && assessed.Value > 0) { <span>Assessed Value: @assessed.Value.ToString(C, new CultureInfo(en-US))</span> } </span> } else { var appraised = @Model.Project.Appraised,var assessed = @Model.Project.Assessed,<span> Site Address: @property.Building.Address.ToString()<br> Site Description: @property.Building.Name<br> Rentable Area: @property.Building.RentableArea Sq. M<br> Building Floors: @property.Building.BuildingFloorCount<br> Predominate Use: @property.Building.BuildingPredominateUse.Name<br> Tenancy: @property.Building.BuildingTenancy<br> Current Holder of the Property: @property.Building.Agency.Name<br> @if (appraised != null && appraised.Value > 0) { <span>Appraised Value: @appraised.Value.ToString(C, new CultureInfo(en-US))</span> } else if (assessed != null && assessed.Value > 0) { <span>Assessed Value: @assessed.Value.ToString(C, new CultureInfo(en-US))</span> } </span> } </li> } </ol> </p> <p>@Model.Project.Notes.FirstOrDefault(n => n.NoteType == NoteTypes.ErpNotification)?.Note</p> <p>If you have any questions regarding this matter, please contact Chris Seltenrich Executive Director of the Strategic Real Estate Services Branch at 778-698-3195.</p> <p>Thank you.</p> <p>Strategic Real Estate Services, Real Property Division</p></body></html>' WHERE name = '30 day ERP notification - Owning Agency';`,
    );
    queryRunner.query(
      `UPDATE notification_template SET body = ' @using System.Linq @using Pims.Dal.Entities @using System.Globalization <html><head><title>@Model.Environment.Title</title></head><body> <p>@(Model.ToAgency.AddressTo ?? Good morning / Good afternoon),</p> <p>This email is a 60 Day Reminder Notification as detailed in the initial Notification of Surplus Real Property below.</p> <p>As detailed in the <a href=https://intranet.gov.bc.ca/assets/intranet/mtics/real-property/who-we-are/branch-sres/process_manual_for_the_surplus_properties_program_-_feb_2020_-_version_2.pdf>Surplus Properties Program Process Manual</a>, the Strategic Real Estate Services Branch (SRES) has committed to proactively notifying all other Ministries, SUCH Sector Organization and Broader Public Sector (BPS) Entities of the availability of a new surplus property.</p> <p>This email is to advise that the following property have been identified as surplus is available for redeployment:</p> <p><b> @Model.Project.ProjectNumber : </b></p> <p> <ol> @foreach (var property in Model.Project.Properties) { <li> @if (property.PropertyType == PropertyTypes.Land) { var appraised = @Model.Project.Appraised,var assessed = @Model.Project.Assessed,<span> Site Address: @property.Parcel.Address.ToString()<br> Site Description: @property.Parcel.Name<br> Site Size: @property.Parcel.LandArea ha<br> Zoned: @property.Parcel.Zoning<br> PID: @property.Parcel.ParcelIdentity<br> Legal: @property.Parcel.LandLegalDescription<br> Current Holder of the Property: @property.Parcel.Agency.Name<br> @if (appraised != null && appraised.Value > 0) { <span>Appraised Value: @appraised.Value.ToString(C, new CultureInfo(en-US))</span> } else if (assessed != null && assessed.Value > 0) { <span>Assessed Value: @assessed.Value.ToString(C, new CultureInfo(en-US))</span> } </span> } else { var appraised = @Model.Project.Appraised,var assessed = @Model.Project.Assessed,<span> Site Address: @property.Building.Address.ToString()<br> Site Description: @property.Building.Name<br> Rentable Area: @property.Building.RentableArea Sq. M<br> Building Floors: @property.Building.BuildingFloorCount<br> Predominate Use: @property.Building.BuildingPredominateUse.Name<br> Tenancy: @property.Building.BuildingTenancy<br> Current Holder of the Property: @property.Building.Agency.Name<br> @if (appraised != null && appraised.Value > 0) { <span>Appraised Value: @appraised.Value.ToString(C, new CultureInfo(en-US))</span> } else if (assessed != null && assessed.Value > 0) { <span>Assessed Value: @assessed.Value.ToString(C, new CultureInfo(en-US))</span> } </span> } </li> } </ol> </p> <p>@Model.Project.Notes.FirstOrDefault(n => n.NoteType == NoteTypes.ErpNotification)?.Note</p> <p>If you have any questions regarding this matter, please contact Chris Seltenrich Executive Director of the Strategic Real Estate Services Branch at 778-698-3195.</p> <p>Thank you.</p> <p>Strategic Real Estate Services, Real Property Division</p></body></html>' WHERE name = '60 day ERP notification - Owning Agency';`,
    );
    queryRunner.query(
      `UPDATE notification_template SET body = ' @using System.Linq @using Pims.Dal.Entities @using System.Globalization <html><head><title>@Model.Environment.Title</title></head><body> <p>@(Model.ToAgency.AddressTo ?? Good morning / Good afternoon),</p> <p>This email is the 90 Day Completion Reminder Notification as detailed in the initial Notification of Surplus Real Property below.</p> <p>As detailed in the <a href=https://intranet.gov.bc.ca/assets/intranet/mtics/real-property/who-we-are/branch-sres/process_manual_for_the_surplus_properties_program_-_feb_2020_-_version_2.pdf>Surplus Properties Program Process Manual</a>, the Strategic Real Estate Services Branch (SRES) has committed to proactively notifying all other Ministries, SUCH Sector Organization and Broader Public Sector (BPS) Entities of the availability of a new surplus property.</p> <p>This email is to advise that the following property have been identified as surplus is available for redeployment:</p> <p><b> @Model.Project.ProjectNumber : </b></p> <p> <ol> @foreach (var property in Model.Project.Properties) { <li> @if (property.PropertyType == PropertyTypes.Land) { var appraised = @Model.Project.Appraised,var assessed = @Model.Project.Assessed,<span> Site Address: @property.Parcel.Address.ToString()<br> Site Description: @property.Parcel.Name<br> Site Size: @property.Parcel.LandArea ha<br> Zoned: @property.Parcel.Zoning<br> PID: @property.Parcel.ParcelIdentity<br> Legal: @property.Parcel.LandLegalDescription<br> Current Holder of the Property: @property.Parcel.Agency.Name<br> @if (appraised != null && appraised.Value > 0) { <span>Appraised Value: @appraised.Value.ToString(C, new CultureInfo(en-US))</span> } else if (assessed != null && assessed.Value > 0) { <span>Assessed Value: @assessed.Value.ToString(C, new CultureInfo(en-US))</span> } </span> } else { var appraised = @Model.Project.Appraised,var assessed = @Model.Project.Assessed,<span> Site Address: @property.Building.Address.ToString()<br> Site Description: @property.Building.Name<br> Rentable Area: @property.Building.RentableArea Sq. M<br> Building Floors: @property.Building.BuildingFloorCount<br> Predominate Use: @property.Building.BuildingPredominateUse.Name<br> Tenancy: @property.Building.BuildingTenancy<br> Current Holder of the Property: @property.Building.Agency.Name<br> @if (appraised != null && appraised.Value > 0) { <span>Appraised Value: @appraised.Value.ToString(C, new CultureInfo(en-US))</span> } else if (assessed != null && assessed.Value > 0) { <span>Assessed Value: @assessed.Value.ToString(C, new CultureInfo(en-US))</span> } </span> } </li> } </ol> </p> <p>@Model.Project.Notes.FirstOrDefault(n => n.NoteType == NoteTypes.ErpNotification)?.Note</p> <p>If you have any questions regarding this matter, please contact Chris Seltenrich Executive Director of the Strategic Real Estate Services Branch at 778-698-3195.</p> <p>Thank you.</p> <p>Strategic Real Estate Services, Real Property Division</p></body></html>' WHERE name = '90 day ERP notification - Owning Agency';`,
    );
    queryRunner.query(
      `UPDATE notification_template SET body = ' @using System.Linq @using Pims.Dal.Entities @using System.Globalization <html><head><title>@Model.Environment.Title</title></head><body> <p>@(Model.ToAgency.AddressTo ?? Good morning / Good afternoon),</p> <p>This email is a 30 Day Reminder Notification as detailed in the initial Notification of Surplus Real Property below.</p> <p>As detailed in the <a href=https://intranet.gov.bc.ca/assets/intranet/mtics/real-property/who-we-are/branch-sres/process_manual_for_the_surplus_properties_program_-_feb_2020_-_version_2.pdf>Surplus Properties Program Process Manual</a>, the Strategic Real Estate Services Branch (SRES) has committed to proactively notifying all other Ministries, SUCH Sector Organization and Broader Public Sector (BPS) Entities of the availability of a new surplus property.</p> <p><b>Please forward this notification to any SUCH Sector Organization or BPS Entity that your ministry is responsible for to ensure any interest from Ministries or Agencies in the properties is identified.</b></p> <p><b>Should there be no interest in the property detailed below from your Ministry or any SUCH Sector Organization or BPS Entity that your Ministry is responsible for, please respond to confirm. </b></p> <p>This email is to advise that the following property has been identified as surplus by the current holder of the property and is available for redeployment if there is a need by your Ministry, SUCH Sector Organization or BPS Entity:</p> <p><b> @Model.Project.ProjectNumber : </b></p> <p> <ol> @foreach (var property in Model.Project.Properties) { <li> @if (property.PropertyType == PropertyTypes.Land) { var appraised = @Model.Project.Appraised,var assessed = @Model.Project.Assessed,<span> Site Address: @property.Parcel.Address.ToString()<br> Site Description: @property.Parcel.Name<br> Site Size: @property.Parcel.LandArea ha<br> Zoned: @property.Parcel.Zoning<br> PID: @property.Parcel.ParcelIdentity<br> Legal: @property.Parcel.LandLegalDescription<br> Current Holder of the Property: @property.Parcel.Agency.Name<br> @if (appraised != null && appraised.Value > 0) { <span>Appraised Value: @appraised.Value.ToString(C, new CultureInfo(en-US))</span> } else if (assessed != null && assessed.Value > 0) { <span>Assessed Value: @assessed.Value.ToString(C, new CultureInfo(en-US))</span> } </span> } else { var appraised = @Model.Project.Appraised,var assessed = @Model.Project.Assessed,<span> Site Address: @property.Building.Address.ToString()<br> Site Description: @property.Building.Name<br> Rentable Area: @property.Building.RentableArea Sq. M<br> Building Floors: @property.Building.BuildingFloorCount<br> Predominate Use: @property.Building.BuildingPredominateUse.Name<br> Tenancy: @property.Building.BuildingTenancy<br> Current Holder of the Property: @property.Building.Agency.Name<br> @if (appraised != null && appraised.Value > 0) { <span>Appraised Value: @appraised.Value.ToString(C, new CultureInfo(en-US))</span> } else if (assessed != null && assessed.Value > 0) { <span>Assessed Value: @assessed.Value.ToString(C, new CultureInfo(en-US))</span> } </span> } </li> } </ol> </p> <p>Your Ministry, SUCH Sector Organization or BPS Entity is provided with 60 days from this notification to submit a Business Case to SRES expressing your interest in acquiring the surplus property. An additional reminder notification will be sent 30 days before this internal listing expires.</p> <p>@Model.Project.Notes.FirstOrDefault(n => n.NoteType == NoteTypes.ErpNotification)?.Note</p> <p>If you have any questions regarding this matter, please contact Chris Seltenrich Executive Director of the Strategic Real Estate Services Branch at 778-698-3195.</p> <p>Thank you.</p> <p>Strategic Real Estate Services, Real Property Division</p></body></html>' WHERE name = '30 day ERP notification - Parent Agencies';`,
    );
    queryRunner.query(
      `UPDATE notification_template SET body = ' @using System.Linq @using Pims.Dal.Entities @using System.Globalization <html><head><title>@Model.Environment.Title</title></head><body> <p>@(Model.ToAgency.AddressTo ?? Good morning / Good afternoon),</p> <p>This email is a 60 Day Reminder Notification as detailed in the initial Notification of Surplus Real Property below.</p> <p>As detailed in the <a href=https://intranet.gov.bc.ca/assets/intranet/mtics/real-property/who-we-are/branch-sres/process_manual_for_the_surplus_properties_program_-_feb_2020_-_version_2.pdf>Surplus Properties Program Process Manual</a>, the Strategic Real Estate Services Branch (SRES) has committed to proactively notifying all other Ministries, SUCH Sector Organization and Broader Public Sector (BPS) Entities of the availability of a new surplus property.</p> <p><b>Please forward this notification to any SUCH Sector Organization or BPS Entity that your ministry is responsible for to ensure any interest from Ministries or Agencies in the properties is identified.</b></p> <p><b>Should there be no interest in the property detailed below from your Ministry or any SUCH Sector Organization or BPS Entity that your Ministry is responsible for, please respond to confirm. </b></p> <p>This email is to advise that the following property has been identified as surplus by the current holder of the property and is available for redeployment if there is a need by your Ministry, SUCH Sector Organization or BPS Entity:</p> <p><b> @Model.Project.ProjectNumber : </b></p> <p> <ol> @foreach (var property in Model.Project.Properties) { <li> @if (property.PropertyType == PropertyTypes.Land) { var appraised = @Model.Project.Appraised,var assessed = @Model.Project.Assessed,<span> Site Address: @property.Parcel.Address.ToString()<br> Site Description: @property.Parcel.Name<br> Site Size: @property.Parcel.LandArea ha<br> Zoned: @property.Parcel.Zoning<br> PID: @property.Parcel.ParcelIdentity<br> Legal: @property.Parcel.LandLegalDescription<br> Current Holder of the Property: @property.Parcel.Agency.Name<br> @if (appraised != null && appraised.Value > 0) { <span>Appraised Value: @appraised.Value.ToString(C, new CultureInfo(en-US))</span> } else if (assessed != null && assessed.Value > 0) { <span>Assessed Value: @assessed.Value.ToString(C, new CultureInfo(en-US))</span> } </span> } else { var appraised = @Model.Project.Appraised,var assessed = @Model.Project.Assessed,<span> Site Address: @property.Building.Address.ToString()<br> Site Description: @property.Building.Name<br> Rentable Area: @property.Building.RentableArea Sq. M<br> Building Floors: @property.Building.BuildingFloorCount<br> Predominate Use: @property.Building.BuildingPredominateUse.Name<br> Tenancy: @property.Building.BuildingTenancy<br> Current Holder of the Property: @property.Building.Agency.Name<br> @if (appraised != null && appraised.Value > 0) { <span>Appraised Value: @appraised.Value.ToString(C, new CultureInfo(en-US))</span> } else if (assessed != null && assessed.Value > 0) { <span>Assessed Value: @assessed.Value.ToString(C, new CultureInfo(en-US))</span> } </span> } </li> } </ol> </p> <p>Your Ministry, SUCH Sector Organization or BPS Entity is provided with 30 days from this notification to submit a Business Case to SRES expressing your interest in acquiring the surplus property.</p> <p>@Model.Project.Notes.FirstOrDefault(n => n.NoteType == NoteTypes.ErpNotification)?.Note</p> <p>If you have any questions regarding this matter, please contact Chris Seltenrich Executive Director of the Strategic Real Estate Services Branch at 778-698-3195.</p> <p>Thank you.</p> <p>Strategic Real Estate Services, Real Property Division</p></body></html>' WHERE name ='60 day ERP notification - Parent Agencies';`,
    );
    queryRunner.query(
      `UPDATE notification_template SET body = ' @using System.Linq @using Pims.Dal.Entities @using System.Globalization <html><head><title>@Model.Environment.Title</title></head><body> <p>@(Model.ToAgency.AddressTo ?? Good morning / Good afternoon),</p> <p>This email is to provide confirmation that the 90 Day Enhanced Referral Period as detailed in the initial Notification of Surplus Real Property below is now complete.</p> <p>As detailed in the <a href=https://intranet.gov.bc.ca/assets/intranet/mtics/real-property/who-we-are/branch-sres/process_manual_for_the_surplus_properties_program_-_feb_2020_-_version_2.pdf>Surplus Properties Program Process Manual</a>, the Strategic Real Estate Services Branch (SRES) has committed to proactively notifying all other Ministries, SUCH Sector Organization and Broader Public Sector (BPS) Entities of the availability of a new surplus property.</p> <p><b>Please forward this notification to any SUCH Sector Organization or BPS Entity that your ministry is responsible for to ensure any interest from Ministries or Agencies in the properties is identified.</b></p> <p><b>Should there be no interest in the property detailed below from your Ministry or any SUCH Sector Organization or BPS Entity that your Ministry is responsible for, please respond to confirm. </b></p> <p>This email is to advise that the following property has been identified as surplus by the current holder of the property and is available for redeployment if there is a need by your Ministry, SUCH Sector Organization or BPS Entity:</p> <p><b> @Model.Project.ProjectNumber : </b></p> <p> <ol> @foreach (var property in Model.Project.Properties) { <li> @if (property.PropertyType == PropertyTypes.Land) { var appraised = @Model.Project.Appraised,var assessed = @Model.Project.Assessed,<span> Site Address: @property.Parcel.Address.ToString()<br> Site Description: @property.Parcel.Name<br> Site Size: @property.Parcel.LandArea ha<br> Zoned: @property.Parcel.Zoning<br> PID: @property.Parcel.ParcelIdentity<br> Legal: @property.Parcel.LandLegalDescription<br> Current Holder of the Property: @property.Parcel.Agency.Name<br> @if (appraised != null && appraised.Value > 0) { <span>Appraised Value: @appraised.Value.ToString(C, new CultureInfo(en-US))</span> } else if (assessed != null && assessed.Value > 0) { <span>Assessed Value: @assessed.Value.ToString(C, new CultureInfo(en-US))</span> } </span> } else { var appraised = @Model.Project.Appraised,var assessed = @Model.Project.Assessed,<span> Site Address: @property.Building.Address.ToString()<br> Site Description: @property.Building.Name<br> Rentable Area: @property.Building.RentableArea Sq. M<br> Building Floors: @property.Building.BuildingFloorCount<br> Predominate Use: @property.Building.BuildingPredominateUse.Name<br> Tenancy: @property.Building.BuildingTenancy<br> Current Holder of the Property: @property.Building.Agency.Name<br> @if (appraised != null && appraised.Value > 0) { <span>Appraised Value: @appraised.Value.ToString(C, new CultureInfo(en-US))</span> } else if (assessed != null && assessed.Value > 0) { <span>Assessed Value: @assessed.Value.ToString(C, new CultureInfo(en-US))</span> } </span> } </li> } </ol> </p> <p>An Enhanced Referral Notification Letter will be sent to the owning Ministry / Agency at the end of the week advising of next steps in the process.</p> <p>@Model.Project.Notes.FirstOrDefault(n => n.NoteType == NoteTypes.ErpNotification)?.Note</p> <p>If you have any questions regarding this matter, please contact Chris Seltenrich Executive Director of the Strategic Real Estate Services Branch at 778-698-3195.</p> <p>Thank you.</p> <p>Strategic Real Estate Services, Real Property Division</p></body></html>' WHERE name = '90 day ERP notification - Parent Agencies';`,
    );
    queryRunner.query(
      `UPDATE notification_template SET body = ' @using System.Linq @using Pims.Dal.Entities @using System.Globalization <html><head><title>@Model.Environment.Title</title></head><body> <p>@(Model.ToAgency.AddressTo ?? Good morning / Good afternoon),</p> <p>This email is a 30 Day Reminder Notification as detailed in the initial Notification of Surplus Real Property below.</p> <p>As detailed in the <a href=https://intranet.gov.bc.ca/assets/intranet/mtics/real-property/who-we-are/branch-sres/process_manual_for_the_surplus_properties_program_-_feb_2020_-_version_2.pdf>Surplus Properties Program Process Manual</a>, the Strategic Real Estate Services Branch (SRES) has committed to proactively notifying all other Ministries, SUCH Sector Organization and Broader Public Sector (BPS) Entities of the availability of a new surplus property.</p> <p>This email is to advise that the following property has been identified as surplus by the current holder of the property and is available for redeployment if there is a need by your Ministry, SUCH Sector Organization or BPS Entity:</p> <p><b> @Model.Project.ProjectNumber : </b></p> <p> <ol> @foreach (var property in Model.Project.Properties) { <li> @if (property.PropertyType == PropertyTypes.Land) { var appraised = @Model.Project.Appraised,var assessed = @Model.Project.Assessed,<span> Site Address: @property.Parcel.Address.ToString()<br> Site Description: @property.Parcel.Name<br> Site Size: @property.Parcel.LandArea ha<br> Zoned: @property.Parcel.Zoning<br> PID: @property.Parcel.ParcelIdentity<br> Legal: @property.Parcel.LandLegalDescription<br> Current Holder of the Property: @property.Parcel.Agency.Name<br> @if (appraised != null && appraised.Value > 0) { <span>Appraised Value: @appraised.Value.ToString(C, new CultureInfo(en-US))</span> } else if (assessed != null && assessed.Value > 0) { <span>Assessed Value: @assessed.Value.ToString(C, new CultureInfo(en-US))</span> } </span> } else { var appraised = @Model.Project.Appraised,var assessed = @Model.Project.Assessed,<span> Site Address: @property.Building.Address.ToString()<br> Site Description: @property.Building.Name<br> Rentable Area: @property.Building.RentableArea Sq. M<br> Building Floors: @property.Building.BuildingFloorCount<br> Predominate Use: @property.Building.BuildingPredominateUse.Name<br> Tenancy: @property.Building.BuildingTenancy<br> Current Holder of the Property: @property.Building.Agency.Name<br> @if (appraised != null && appraised.Value > 0) { <span>Appraised Value: @appraised.Value.ToString(C, new CultureInfo(en-US))</span> } else if (assessed != null && assessed.Value > 0) { <span>Assessed Value: @assessed.Value.ToString(C, new CultureInfo(en-US))</span> } </span> } </li> } </ol> </p> <p>Your Ministry, SUCH Sector Organization or BPS Entity is provided with 60 days from this notification to submit a Business Case to SRES expressing your interest in acquiring the surplus property.</p> <p>@Model.Project.Notes.FirstOrDefault(n => n.NoteType == NoteTypes.ErpNotification)?.Note</p> <p>If you have any questions regarding this matter, please contact Chris Seltenrich Executive Director of the Strategic Real Estate Services Branch at 778-698-3195.</p> <p>Thank you.</p> <p>Strategic Real Estate Services, Real Property Division</p></body></html>' WHERE name = '30 day ERP notification - Purchasing Agencies';`,
    );
    queryRunner.query(
      `UPDATE notification_template SET body = ' @using System.Linq @using Pims.Dal.Entities @using System.Globalization <html><head><title>@Model.Environment.Title</title></head><body> <p>@(Model.ToAgency.AddressTo ?? Good morning / Good afternoon),</p> <p>This email is a 60 Day Reminder Notification as detailed in the initial Notification of Surplus Real Property below.</p> <p>As detailed in the <a href=https://intranet.gov.bc.ca/assets/intranet/mtics/real-property/who-we-are/branch-sres/process_manual_for_the_surplus_properties_program_-_feb_2020_-_version_2.pdf>Surplus Properties Program Process Manual</a>, the Strategic Real Estate Services Branch (SRES) has committed to proactively notifying all other Ministries, SUCH Sector Organization and Broader Public Sector (BPS) Entities of the availability of a new surplus property.</p> <p>This email is to advise that the following property has been identified as surplus by the current holder of the property and is available for redeployment if there is a need by your Ministry, SUCH Sector Organization or BPS Entity:</p> <p><b> @Model.Project.ProjectNumber : </b></p> <p> <ol> @foreach (var property in Model.Project.Properties) { <li> @if (property.PropertyType == PropertyTypes.Land) { var appraised = @Model.Project.Appraised,var assessed = @Model.Project.Assessed,<span> Site Address: @property.Parcel.Address.ToString()<br> Site Description: @property.Parcel.Name<br> Site Size: @property.Parcel.LandArea ha<br> Zoned: @property.Parcel.Zoning<br> PID: @property.Parcel.ParcelIdentity<br> Legal: @property.Parcel.LandLegalDescription<br> Current Holder of the Property: @property.Parcel.Agency.Name<br> @if (appraised != null && appraised.Value > 0) { <span>Appraised Value: @appraised.Value.ToString(C, new CultureInfo(en-US))</span> } else if (assessed != null && assessed.Value > 0) { <span>Assessed Value: @assessed.Value.ToString(C, new CultureInfo(en-US))</span> } </span> } else { var appraised = @Model.Project.Appraised,var assessed = @Model.Project.Assessed,<span> Site Address: @property.Building.Address.ToString()<br> Site Description: @property.Building.Name<br> Rentable Area: @property.Building.RentableArea Sq. M<br> Building Floors: @property.Building.BuildingFloorCount<br> Predominate Use: @property.Building.BuildingPredominateUse.Name<br> Tenancy: @property.Building.BuildingTenancy<br> Current Holder of the Property: @property.Building.Agency.Name<br> @if (appraised != null && appraised.Value > 0) { <span>Appraised Value: @appraised.Value.ToString(C, new CultureInfo(en-US))</span> } else if (assessed != null && assessed.Value > 0) { <span>Assessed Value: @assessed.Value.ToString(C, new CultureInfo(en-US))</span> } </span> } </li> } </ol> </p> <p>Your Ministry, SUCH Sector Organization or BPS Entity is provided with 30 days from this notification to submit a Business Case to SRES expressing your interest in acquiring the surplus property.</p> <p>@Model.Project.Notes.FirstOrDefault(n => n.NoteType == NoteTypes.ErpNotification)?.Note</p> <p>If you have any questions regarding this matter, please contact Chris Seltenrich Executive Director of the Strategic Real Estate Services Branch at 778-698-3195.</p> <p>Thank you.</p> <p>Strategic Real Estate Services, Real Property Division</p></body></html>' WHERE name = '60 day ERP notification - Purchasing Agencies';`,
    );
    queryRunner.query(
      `UPDATE notification_template SET body = ' @using System.Linq @using Pims.Dal.Entities @using System.Globalization <html><head><title>@Model.Environment.Title</title></head><body> <p>@(Model.ToAgency.AddressTo ?? Good morning / Good afternoon),</p> <p>This email is to provide confirmation that the 90 Day Enhanced Referral Period as detailed in the initial Notification of Surplus Real Property below is now complete.</p> <p>As detailed in the <a href=https://intranet.gov.bc.ca/assets/intranet/mtics/real-property/who-we-are/branch-sres/process_manual_for_the_surplus_properties_program_-_feb_2020_-_version_2.pdf>Surplus Properties Program Process Manual</a>, the Strategic Real Estate Services Branch (SRES) has committed to proactively notifying all other Ministries, SUCH Sector Organization and Broader Public Sector (BPS) Entities of the availability of a new surplus property.</p> <p>This email is to advise that the following property has been identified as surplus by the current holder of the property and is available for redeployment if there is a need by your Ministry, SUCH Sector Organization or BPS Entity:</p> <p><b> @Model.Project.ProjectNumber : </b></p> <p> <ol> @foreach (var property in Model.Project.Properties) { <li> @if (property.PropertyType == PropertyTypes.Land) { var appraised = @Model.Project.Appraised,var assessed = @Model.Project.Assessed,<span> Site Address: @property.Parcel.Address.ToString()<br> Site Description: @property.Parcel.Name<br> Site Size: @property.Parcel.LandArea ha<br> Zoned: @property.Parcel.Zoning<br> PID: @property.Parcel.ParcelIdentity<br> Legal: @property.Parcel.LandLegalDescription<br> Current Holder of the Property: @property.Parcel.Agency.Name<br> @if (appraised != null && appraised.Value > 0) { <span>Appraised Value: @appraised.Value.ToString(C, new CultureInfo(en-US))</span> } else if (assessed != null && assessed.Value > 0) { <span>Assessed Value: @assessed.Value.ToString(C, new CultureInfo(en-US))</span> } </span> } else { var appraised = @Model.Project.Appraised,var assessed = @Model.Project.Assessed,<span> Site Address: @property.Building.Address.ToString()<br> Site Description: @property.Building.Name<br> Rentable Area: @property.Building.RentableArea Sq. M<br> Building Floors: @property.Building.BuildingFloorCount<br> Predominate Use: @property.Building.BuildingPredominateUse.Name<br> Tenancy: @property.Building.BuildingTenancy<br> Current Holder of the Property: @property.Building.Agency.Name<br> @if (appraised != null && appraised.Value > 0) { <span>Appraised Value: @appraised.Value.ToString(C, new CultureInfo(en-US))</span> } else if (assessed != null && assessed.Value > 0) { <span>Assessed Value: @assessed.Value.ToString(C, new CultureInfo(en-US))</span> } </span> } </li> } </ol> </p> <p>Your Ministry, SUCH Sector Organization or BPS Entity is provided with until the end of this week from this notification to submit a Business Case to SRES expressing your interest in acquiring the surplus property.</p> <p>An Enhanced Referral Notification Letter will be sent to the owning Ministry / Agency at the end of the week advising of next steps in the process.</p> <p>@Model.Project.Notes.FirstOrDefault(n => n.NoteType == NoteTypes.ErpNotification)?.Note</p> <p>If you have any questions regarding this matter, please contact Chris Seltenrich Executive Director of the Strategic Real Estate Services Branch at 778-698-3195.</p> <p>Thank you.</p> <p>Strategic Real Estate Services, Real Property Division</p></body></html>' WHERE name = '90 day ERP notification - Purchasing Agencies';`,
    );
    queryRunner.query(
      `UPDATE notification_template SET body = ' <html><head><title>@Model.Environment.Title</title></head> <body><p>Dear Administrator,</p><p>@Model.AccessRequest.User.FirstName @Model.AccessRequest.User.LastName has submitted an access request to <a href=@Model.Environment.Uri>PIMS</a>.</p><p>Signin and review their request.</p></body></html>' WHERE name = 'Access Request';`,
    );
    queryRunner.query(
      `UPDATE notification_template SET subject = 'PIMS - Project Note Updated - @Model.Project.ProjectNumber', body = ' @using System.Linq @using Pims.Dal.Entities <html><head><title>@Model.Environment.Title</title></head> <body><p>Dear @(Model.Project.Manager ?? Property Manager),</p><p>Your project @Model.Project.ProjectNumber has been updated with the following note,</p><p>@Model.Project.Notes.FirstOrDefault(n => n.NoteType == NoteTypes.Public)?.Note</p></body></html>' WHERE name = 'Project Shared Note Changed';`,
    );
    queryRunner.query(
      `UPDATE notification_template SET body = ' <html><head><title>@Model.Environment.Title</title></head> <body><p>Dear Administrator,</p><p>@Model.AccessRequest.User.FirstName @Model.AccessRequest.User.LastName has submitted an access request to <a href=@Model.Environment.Uri>PIMS</a>.</p><p>Signin and review their request.</p></body></html>' WHERE name = 'Access Request RPD Mailbox';`,
    );
  }
}
