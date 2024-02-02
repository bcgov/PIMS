export const getMappedRole = (oldRole: string) => {
  switch (true) {
    case ['Minister Assistant', 'Minister', 'Assistant Deputy', 'Executive Director', 'View Only Properties'].includes(oldRole):
      return 'auditor';
    case ['Manager', 'Agency Administrator', 'Real Estate Analyst', 'Real Estate Manager'].includes(oldRole):
      return 'general user';
    case ['System Administrator', 'SRES', 'SRES Financial Reporter', 'SRES Financial', 'SRES Financial Manager'].includes(oldRole):
      return 'admin';
    default:
      throw new Error(`No mapped role found for original role: ${oldRole}`);
  }
}
