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
  // TODO: REMOVE THESE TESTS BEFORE MERGING
  // REVERT THE ENTIRE FILE

  // const result = nunjucks.renderString(`
  // <html>
  //   <body>
  //   <h1>header</h1>
  //   <p>{{para}}</p>
  //   </body>
  // </html>`,
  // {
  //   para: 'this is a paragraph'
  // })
  const result = nunjucks.render('trial.njk', {
    title: 'title',
    numberLink: 'https://www.google.ca',
    projectNumberLink: 'SPR-1000',
    properties: [
      {
        type: 'Land',
        address: '3596 Evergreen Terr.',
        landArea: '234',
        zoning: 'Residential',
        pid: 12323412,
        legalDescription: 'LEGAL DESC',
        agency: {
          name: 'CITZ',
        },
      },
    ],
  });

  //   const result = nunjucks.renderString(`
  //   <html>
  //   <head>
  //     <title>{{ title }}</title>
  //   </head>
  //   <body>
  //     <p>Good afternoon,</p>
  //     <p>This email is to advise that the following properties have been submitted to the Surplus Property Program to be reviewed as surplus by the current holder of the property and is requesting your review:</p>
  //     <p> Property Inventory Management System - <a href={{ numberLink }}>{{ projectNumberLink }}</a>
  //     </p>
  //     <p>
  //       <ol>

  //       </ol>
  //     </p>
  //     <p> Thank you.</p>
  //     <p> Strategic Real Estate Services, Real Property Division</p>
  //   </body>
  // </html>`, {
  //     title: 'title',
  //     numberLink: 'https://www.google.ca',
  //     projectNumberLink: 'https://www.google.ca',
  //     properties: []
  //   })
  return res.status(200).send(result);
};
