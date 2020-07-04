module.exports = {
	apps: [
		{
			name: 'api-rest-mongodb',
			script: './dist/main.js',
			instances: 2,
			exec_mode: 'cluster',
			watch: true,
			merge_logs: true,
			env: {
				SERVER_PORT: 3000,
				DB_HOST: '192.168.0.160',
				NODE_ENV: 'development'
			},
			env_dev: {
				SERVER_PORT: 3000,
				DB_HOST: '192.168.0.160',
				NODE_ENV: 'development'
			},
			env_production: {
				SERVER_PORT: 5000,
				DB_HOST: '192.168.0.160',
				NODE_ENV: 'production',
				ENABLE_HTTPS: true
			}
		}
	]
};
