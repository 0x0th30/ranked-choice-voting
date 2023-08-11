export const SuccessCreateVotingDTO = {
  success: true,
  data: { uuid: 'f@k3-uuid-h3r3' },
};

export const FailedCreateVotingDTO = {
  success: false,
  error: new Error('GENERIC_ERROR'),
};
