var system_timezone = require('../index.js');

describe('System Timezone', () => it('Not crash', () => console.log(`TimeZone:: ${system_timezone()}`)));