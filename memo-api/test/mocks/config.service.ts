export const mockedConfigService = {
  get(key: string) {
    switch (key) {
      case 'jwtExpirationTime':
        return '1d';
    }
  },
};
