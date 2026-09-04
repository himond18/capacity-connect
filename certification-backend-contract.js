/* Capacity Connect — certification backend contract
   This module is intentionally standalone so it can be integrated without replacing server.js.
   Expected table: certifications with trainee/user + course references and issued metadata.
*/
const certificationContract = {
  trainee: {
    issue: 'POST /api/trainee/certifications',
    mine: 'GET /api/trainee/certifications'
  },
  rule: 'Issue only when the authenticated trainee has completed the selected course and has passed its required assessment(s).',
  adminStat: 'Certifications Issued must be counted from the certifications table.'
};
module.exports = certificationContract;
