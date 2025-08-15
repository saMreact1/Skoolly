const Subject = require('../models/subject.model');
const defaultSubjects = require('../config/defaultSubjects');

function flattenSecondary(def) {
  if (!def || typeof def === 'string') return [];
  if (Array.isArray(def)) return def; // in case you made it a flat array
  const { core = [], electives = [] } = def;
  return [...core, ...electives];
}

async function generateDefaultSubjects(schoolType, tenantId, session) {
  let subjectsList = [];

  // Ensure we always work with an array
  const schoolTypesArray = Array.isArray(schoolType) ? schoolType : [schoolType];

  for (const type of schoolTypesArray) {
    if (type === 'senior_secondary') {
      subjectsList.push(...flattenSecondary(defaultSubjects[type]));
    } else {
      subjectsList.push(...(defaultSubjects[type] || []));
    }
  }

  // Remove duplicates
  subjectsList = [...new Set(subjectsList.map(s => s.trim()))];

  if (!subjectsList.length) return;

  const ops = subjectsList.map((name) => {
    const nameLower = name.toLowerCase().trim();
    return {
      updateOne: {
        filter: { tenantId, nameLower },
        update: { $setOnInsert: { tenantId, name, nameLower, compulsory: true } },
        upsert: true
      }
    };
  });

  await Subject.bulkWrite(ops, { session });
}


module.exports = { generateDefaultSubjects };
