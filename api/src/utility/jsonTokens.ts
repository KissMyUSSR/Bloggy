import jwt, { VerifyErrors, JwtPayload } from 'jsonwebtoken';

const ACCESS_TOKEN_EXPIRATION_TIME = '10m';

export const verifyToken = async (
  token: string,
  key: string
): Promise<{
  err: VerifyErrors | null;
  decoded: string | JwtPayload | undefined;
}> => {
  return new Promise((resolve, reject) =>
    jwt.verify(token, key, (err, decoded) =>
      err ? reject({ err }) : resolve({ err: null, decoded })
    )
  );
};

export const generateAccessToken = (username: string, email: string) =>
  jwt.sign({ username, email }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: ACCESS_TOKEN_EXPIRATION_TIME,
  });

export const verifyAccessToken = async (accessToken: string | undefined) => {
  if (!accessToken) {
    return { err: true, status: 401, message: 'No access token' };
  }

  const { err, decoded: user } = await verifyToken(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET!
  );

  if (err) {
    return { err: true, status: 401, message: 'Incorrect access token' };
  }

  if (typeof user === 'string' || user === undefined) {
    console.error('The user is incorrect! User: ' + user);
    return {
      err: true,
      status: 500,
      message: 'Oops... Something went very wrong!',
    };
  }

  return user;
};
