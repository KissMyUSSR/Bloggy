import User from '../models/User';

export const validateCategories = (v: string[]) => v.length <= 10;

export const validateEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export async function validateRegistration(data: Partial<TUser>) {
  const errors = await validateUniqueness({
    username: data.username,
    email: data.email,
  });

  if (data.password) {
    const passwordError = validatePassword(data.password);
    if (passwordError) errors.push(['password', passwordError]);
  }

  if (errors.length === 0) return { res: true, errors: null };
  return { res: false, errors: Object.fromEntries(errors) };
}

function validatePassword(password: string) {
  if (password.length < 5) {
    return getMongoDbValidationErrorObj({
      path: 'password',
      value: password,
      name: 'ValidatorError',
      message: `Password must be at least 5 characters long`,
    });
  } else if (password.length > 20) {
    return getMongoDbValidationErrorObj({
      path: 'password',
      value: password,
      name: 'ValidatorError',
      message: `Password must be at most 20 characters long`,
    });
  }
  return null;
}

async function validateUniqueness(data: Partial<TUser>) {
  const errors = await Promise.all(
    Object.entries(data).map(async (datum) => {
      const user = await User.findOne({ [datum[0]]: datum[1] });

      if (!user) return null;

      return [
        datum[0],
        getMongoDbValidationErrorObj({
          path: datum[0],
          value: datum[1],
        }),
      ];
    })
  );
  const filteredErrors = errors.filter(truthyFilter);

  return filteredErrors;
}

type GetMongoDbValidationErrorObj = {
  path: string;
  value: unknown;
  name?: string;
  message?: string;
};

const getMongoDbValidationErrorObj = ({
  path,
  value,
  message = 'UniquenessError',
  name = `This ${path} is already taken`,
}: GetMongoDbValidationErrorObj) => ({
  name,
  message,
  properties: {
    message,
    type: 'user defined',
    path,
    value,
  },
  kind: 'user defined',
  path,
  value,
});

const truthyFilter = <T>(x: T | false | undefined | null | '' | 0): x is T =>
  !!x;

export function validatePost(postData: Partial<TPost>) {
  // Check if req.body.authorName is the same person as the authorized one

  postData.categories = [...new Set(postData.categories)];
  if (validateDisplayType(postData.displayType)) {
    postData.displayType = 0;
  }
}

function validateDisplayType(displayType: number | undefined): boolean {
  return (
    !!displayType &&
    (displayType <= 0 || displayType > 2 || displayType % 1 !== 0)
  );
}