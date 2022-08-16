// eslint-disable-next-line @typescript-eslint/naming-convention
export type EmailAddress = string & { __type: 'email' };

const toEmailAddress = (email: string): EmailAddress => {
  return email.trim() as EmailAddress;
};

export const emailAddress = {
  toEmailAddress,
};
