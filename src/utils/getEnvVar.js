export const getEnvVar = (name, defaultValue) => {
  const value = process.env[name];

  if (!value && !defaultValue) {
    throw new Error(`Environment variable ${name} is not set`);
  }

  return value || defaultValue;
};
