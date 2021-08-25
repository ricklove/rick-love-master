
export type EmailAddress = string & { __type: 'email' };
export const toEmailAddress = (email: string): EmailAddress => {
    return email.trim() as EmailAddress;
};
