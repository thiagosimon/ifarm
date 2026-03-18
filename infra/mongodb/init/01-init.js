db = db.getSiblingDB('admin');
db.auth('ifarm', 'ifarm123');

const databases = [
  'ifarm_identity',
  'ifarm_catalog',
  'ifarm_quotation',
  'ifarm_matching',
  'ifarm_notification',
  'ifarm_review',
  'ifarm_tax',
];

databases.forEach(function(dbName) {
  db = db.getSiblingDB(dbName);
  db.createUser({
    user: 'ifarm',
    pwd: 'ifarm123',
    roles: [{ role: 'readWrite', db: dbName }]
  });
});
