module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  moduleNameMapper: {
    '^@pages$': '<rootDir>/src/pages',
    '^@components$': '<rootDir>/src/components',
    '^@ui$': '<rootDir>/src/components/ui',
    '^@ui-pages$': '<rootDir>/src/components/ui/pages',
    '^@utils-types$': '<rootDir>/src/utils/types',
    '^@api$': '<rootDir>/src/utils/burger-api.ts', // Алиас для @api
    '^@slices/(.*)$': '<rootDir>/src/services/slices/$1', // Для @slices/*
    '^@selectors$': '<rootDir>/src/services/selectors',
    '^@utils$': '<rootDir>/src/utils',
    '^@hooks$': '<rootDir>/src/hooks',
    '^@services$': '<rootDir>/src/services',
    '^@store$': '<rootDir>/src/services/store'
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)']
};
