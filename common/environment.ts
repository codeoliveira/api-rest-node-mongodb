export const environment = {
	server: {
		PORT: process.env.SERVER_PORT || 3000,
		HOST: process.env.SERVER_HOST || `localhost`
	},
	db: {
		PROTOCOL: process.env.DB_PROTOCOL || `mongodb://`,
		HOST: process.env.DB_HOST || `192.168.0.160`,
		PORT: process.env.DB_PORT || `27017`,
		DB: process.env.DB_DB || `api-rest-mongodb`,
		USER: process.env.DB_USER || `admin`,
		PASSWORD: process.env.DB_PASSWORD || `dev102030`
	},
	security: {
		saltRounds: process.env.saltRounds || 10
	}
};
