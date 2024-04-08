export const getMappedRole = (oldRole: string) => {
  switch (true) {
    case ['Minister Assistant', 'Minister', 'Assistant Deputy', 'Executive Director', 'View Only Properties'].includes(oldRole):
      return 'Auditor';
    case ['Manager', 'Agency Administrator', 'Real Estate Analyst', 'Real Estate Manager', 'Assistant Deputy Minister'].includes(oldRole):
      return 'General User';
    case ['System Administrator', 'SRES', 'SRES Financial Reporter', 'SRES Financial', 'SRES Financial Manager'].includes(oldRole):
      return 'Administrator';
    default:
      throw new Error(`No mapped role found for original role: ${oldRole}`);
  }
}
