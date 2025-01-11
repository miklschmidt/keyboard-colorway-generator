import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname,
});

const eslintConfig = [
	...compat.extends(
		'next/core-web-vitals',
		'next/typescript',
		'plugin:react-hooks/recommended',
		'plugin:valtio/recommended',
		'plugin:react/recommended',
	),
	...compat.plugins('@typescript-eslint', 'unused-imports', 'prettier', '@limegrass/import-alias'),
	...compat.config({
		overrides: [
			{
				files: ['*.tsx', '*.ts'],
				parser: '@typescript-eslint/parser',
				parserOptions: {
					projectService: true,
					tsconfigRootDir: import.meta.dirname,
				},
				rules: {
					'react/react-in-jsx-scope': 'off',
					'react/no-unknown-property': 'off',
					'react/no-unescaped-entities': 'off',
					'react/prop-types': 'off',
					'jsx-quotes': 1,
					'no-duplicate-imports': 1,
					'@limegrass/import-alias/import-alias': ['error', { aliasConfigPath: './tsconfig.json' }],
					'unused-imports/no-unused-imports': 'error',
					'prettier/prettier': ['warn', { endOfLine: 'auto' }],
					'@typescript-eslint/consistent-type-imports': [
						'warn',
						{
							prefer: 'type-imports',
							fixStyle: 'inline-type-imports',
						},
					],
					'@typescript-eslint/no-unused-vars': [
						'warn',
						{
							argsIgnorePattern: '^_',
						},
					],
					'@typescript-eslint/no-misused-promises': [
						'error',
						{
							checksVoidReturn: {
								attributes: false,
							},
						},
					],
					'react/display-name': 'off',
					'no-console': 'error',
					camelcase: ['warn'],
					'no-restricted-syntax': ['error', 'IfStatement[alternate=null] > ReturnStatement'],
				},
			},
		],
	}),
];

export default eslintConfig;
