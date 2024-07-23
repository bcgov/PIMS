import { ValueTransformer } from 'typeorm';

// When using the built in postgres type 'money' for a db column, TypeORM will return these values as a string
// with the format "$123,456,789" unless a transformer like this is used.
const MoneyTransfomer: ValueTransformer = {
  to: (val: string | number) => (val === null ? null : Number(val)),
  from: (val: string) => (val === null ? null : Number(val.replace(/[$,]/g, ''))),
};

export default MoneyTransfomer;
