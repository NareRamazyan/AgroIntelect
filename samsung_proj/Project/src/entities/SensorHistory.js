const { EntitySchema } = require('typeorm');

const SensorHistorySchema = new EntitySchema({
  name:      'SensorHistory',
  tableName: 'sensor_history',
  columns: {
    id:          { primary: true, type: 'int', generated: true },
    N:           { type: 'float' },
    P:           { type: 'float' },
    K:           { type: 'float' },
    temperature: { type: 'float' },
    humidity:    { type: 'float' },
    ph:          { type: 'float' },
    rainfall:    { type: 'float' },
    crop:        { type: 'varchar' },
    confidence:  { type: 'int' },
    recordedAt:  { type: 'timestamp', createDate: true },
  },
});

module.exports = { SensorHistorySchema };