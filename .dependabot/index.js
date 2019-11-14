function configDependabot() {
    const fs = require('fs');
    const path = require('path');
    const directories = fs.readdirSync(path.join(__dirname, '../packages'));
    const stream = fs.createWriteStream('./.dependabot/config.yml');

    const pckg = '  - package_manager: "javascript"\n';
    const dir = '    directory: "/"\n';
    const update = '    update_schedule: "live"\n';
    const reviewers = '    default_reviewers:\n' +
        '      - ArtemFrantsiian\n' +
        '      - ni3gavhane\n';

    stream.write('version: 1\n\n');
    stream.write('update_configs:\n');
    stream.write(pckg);
    stream.write(dir);
    stream.write(update);
    stream.write(reviewers);

    for (const index in directories) {
        stream.write('\n');
        stream.write(pckg);
        stream.write('    directory: "/packages/' + directories[index] + '"\n');
        stream.write(update);
        stream.write(reviewers);
    }

    stream.end();
};

module.exports = configDependabot;