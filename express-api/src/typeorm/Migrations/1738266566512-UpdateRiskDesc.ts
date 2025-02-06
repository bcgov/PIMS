import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateRiskDesc1738266566512 implements MigrationInterface {
  //   *** Risk Adjustment amount is calculated based on the risk associated with completion of the sale of a property during the forecasted fiscal year:

  // Red Status is used when it is determined there is a high risk the sale will not complete in the fiscal year.  This could be due to a number of factors including but not limited to: consultation with the First Nations that is not expected to be complete, property is expected to be deleted from the Surplus Properties list, issues with preparing the property for sale.  100% of the forecasted net proceeds are adjusted in the forecast as contingency/slippage.

  // Yellow Status is used when it is determined there is a probability the sale will complete in the fiscal year; however there is some associated risk. This could be due to a number of factors including but not limited to: First Nations benefits agreement agreed in principal but not signed, waiting for final environmental certificates. 50% of the forecasted net proceeds are adjusted in the forecast as contingency/slippage.

  // Green status is used when it is determined it is likely the sale will complete in the fiscal year.  10% of the forecasted net proceeds are adjusted in the forecast as contingency/slippage where the sale has not yet completed or final financial confirmation amounts not provided.

  // Risk status on property sales can change through the sales process.

  public async up(queryRunner: QueryRunner): Promise<void> {
    /**
     * Low possibility of sale not completing in predicted fiscal year.
     * 10% of the forecasted net proceeds are adjusted in the forecast as contingency/slippage.
     */
    await queryRunner.query(
      `UPDATE project_risk SET description = 'Low possibility of sale not completing in predicted fiscal year. 10% of the forecasted net proceeds are adjusted in the forecast as contingency/slippage.' WHERE code = 'GREEN';`,
    );
    /**
     * Medium possibility of sale not completing in predicted fiscal year.
     * 50% of the forecasted net proceeds are adjusted in the forecast as contingency/slippage.
     */
    await queryRunner.query(
      `UPDATE project_risk SET description = 'Medium possibility of sale not completing in predicted fiscal year. 50% of the forecasted net proceeds are adjusted in the forecast as contingency/slippage.' WHERE code = 'YELLOW';`,
    );
    /**
     * High possibility of sale not completing in predicted fiscal year.
     * 100% of the forecasted net proceeds are adjusted in the forecast as contingency/slippage.
     */
    await queryRunner.query(
      `UPDATE project_risk SET description = 'High possibility of sale not completing in predicted fiscal year. 100% of the forecasted net proceeds are adjusted in the forecast as contingency/slippage.' WHERE code = 'RED';`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE project_risk SET description = '90-100% of the property value' WHERE code = 'GREEN';`,
    );
    await queryRunner.query(
      `UPDATE project_risk SET description = '50% of the property value' WHERE code = 'YELLOW';`,
    );
    await queryRunner.query(
      `UPDATE project_risk SET description = '0% of the property value' WHERE code = 'RED';`,
    );
  }
}
