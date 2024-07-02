import { GridSubtitle, GridColumnPair } from '@/components/common/GridHelpers';
import { LtsaOrder } from '@/hooks/api/useLtsaApi';
import { formatMoney, dateFormatter } from '@/utilities/formatters';
import { Box, CircularProgress, Grid, Typography } from '@mui/material';
import React from 'react';

interface LtsaDetailsProps {
  ltsaData: LtsaOrder;
  isLoading: boolean;
  width?: string | number;
}

const LtsaDetails = (props: LtsaDetailsProps) => {
  const { ltsaData, isLoading, width } = props;

  if (isLoading) {
    return (
      <Box display="flex" justifyContent={'center'} paddingTop={'2em'} minWidth={width}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box minWidth={width} height={'300px'} overflow={'scroll'}>
      <Grid container gap={1}>
        {ltsaData && ltsaData.order ? (
          <>
            {/* TITLE DETAILS */}
            <GridSubtitle>Title Details</GridSubtitle>
            <GridColumnPair
              leftValue={'Title Number'}
              rightValue={ltsaData?.order.productOrderParameters.titleNumber}
              alignment="start"
            />
            <GridColumnPair
              leftValue={'Legal Description'}
              rightValue={
                ltsaData?.order.orderedProduct.fieldedData.descriptionsOfLand.at(0)
                  .fullLegalDescription
              }
              alignment="start"
            />
            <GridColumnPair
              leftValue={'Title Status'}
              rightValue={ltsaData?.order.status}
              alignment="start"
            />
            <GridColumnPair
              leftValue={'Sales History'}
              rightValue={formatMoney(
                parseInt(ltsaData?.order.orderedProduct.fieldedData.tombstone.marketValueAmount),
              )}
              alignment="start"
            />
            <GridColumnPair
              leftValue={'Application Received'}
              rightValue={dateFormatter(
                ltsaData?.order.orderedProduct.fieldedData.tombstone.applicationReceivedDate,
              )}
              alignment="start"
            />
            <GridColumnPair
              leftValue={'Entered On'}
              rightValue={dateFormatter(
                ltsaData?.order.orderedProduct.fieldedData.tombstone.enteredDate,
              )}
              alignment="start"
            />
            {/* OWNERSHIP */}
            <GridSubtitle>Ownership by Interest</GridSubtitle>
            <Grid container item xs={12}>
              <Grid item xs={2}>
                %
              </Grid>
              <Grid container item xs={10}>
                <Grid item xs={9}>
                  {'Owner(s)'}
                </Grid>
                <Grid item xs={3}>
                  {'Incorporation #'}
                </Grid>
              </Grid>
            </Grid>

            {ltsaData.order.orderedProduct.fieldedData.ownershipGroups.map((group, index) => (
              <Grid item container xs={12} key={index}>
                <Grid item xs={2}>
                  <Typography variant="smallTable">
                    {`${((parseFloat(group.interestFractionNumerator) / parseFloat(group.interestFractionDenominator)) * 100).toFixed(2)}%`}{' '}
                  </Typography>
                </Grid>
                <Grid item xs={10} container>
                  {ltsaData.order.orderedProduct.fieldedData.ownershipGroups
                    .at(index)
                    .titleOwners.map((owner, subindex) => (
                      <Grid item container xs={12} key={subindex}>
                        <Grid item xs={9}>
                          <Typography variant="smallTable">
                            {`${owner.lastNameOrCorpName1}${owner.givenName ? `, ${owner.givenName}` : ''}`}{' '}
                          </Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <Typography variant="smallTable">{owner.incorporationNumber}</Typography>
                        </Grid>
                      </Grid>
                    ))}
                </Grid>
              </Grid>
            ))}

            {/* CHARGES */}
            <GridSubtitle>Charge Details</GridSubtitle>
            {ltsaData.order.orderedProduct.fieldedData.chargesOnTitle ? (
              <>
                <Grid container item xs={12}>
                  <Grid item xs={2}>
                    #
                  </Grid>
                  <Grid item xs={2}>
                    Status
                  </Grid>
                  <Grid item xs={2}>
                    Received
                  </Grid>
                  <Grid item xs={3}>
                    Transaction Type
                  </Grid>
                  <Grid item xs={3}>
                    Remarks
                  </Grid>
                </Grid>
                {ltsaData.order.orderedProduct.fieldedData.chargesOnTitle.map(
                  (chargeOnTitle, index) => (
                    <Grid key={index} item container xs={12}>
                      <Grid item xs={2}>
                        <Typography variant="smallTable">{chargeOnTitle.chargeNumber}</Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <Typography variant="smallTable">{chargeOnTitle.status}</Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <Typography variant="smallTable">
                          {dateFormatter(chargeOnTitle.charge.applicationReceivedDate)}
                        </Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography variant="smallTable">
                          {chargeOnTitle.charge.transactionType}
                        </Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography variant="smallTable">{chargeOnTitle.chargeRemarks}</Typography>
                      </Grid>
                    </Grid>
                  ),
                )}
              </>
            ) : (
              <Typography variant="caption">No charge information available.</Typography>
            )}
          </>
        ) : (
          <Typography variant="body2">No LTSA information available.</Typography>
        )}
      </Grid>
    </Box>
  );
};

export default LtsaDetails;
