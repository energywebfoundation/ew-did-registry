const fs = require('fs');
const path = require('path');

const config = `version: 1

update_configs:
`;

const packageTemplate = (dir) => `
  - package_manager: "javascript"
    directory: "${dir}"
    update_schedule: "live"
    default_reviewers:
      - ArtemFrantsiian
      - ni3gavhane
`;

function configDependabot() {
    const directories = [
        '/',
        ...fs.readdirSync(path.join(__dirname, '../packages'))
    ];

    const stream = fs.createWriteStream('./.dependabot/config.yml');

    stream.write(config);

    directories.forEach(function(directory) {
        const path = `/packages/${directory}`;
        stream.write(packageTemplate(path));
    });

    stream.end();
};

module.exports = configDependabot;