module.exports = {
	apps : [
		{
			name: 'JckBot',
			script: 'app.js',
			instances: 1,
			exec_mode  : "cluster",
			autorestart: true,
			watch: true,
			ignore_watch : ["node_modules", "public/images"]
		}
	],

	deploy : {
		production : {
			user : 'node',
			host : '212.83.163.1',
			ref  : 'origin/master',
			repo : 'git@github.com:repo.git',
			path : '/var/www/production',
				'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
		}
	}
};
