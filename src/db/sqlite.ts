import initSqlJs, { Database } from 'sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { DEFAULT_USER_PROFILE, INITIAL_FITNESS_PLAN } from '../utils/defaultData.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Data directory for SQLite file
const DATA_DIR = path.resolve(__dirname, '../../data');
const DB_PATH = path.resolve(DATA_DIR, 'fitbuddy.sqlite');

let dbInstance: Database | null = null;

export async function getDb(): Promise<Database> {
  if (dbInstance) return dbInstance;

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  const SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    dbInstance = new SQL.Database(fileBuffer);
  } else {
    dbInstance = new SQL.Database();
  }

  initTables(dbInstance);
  seedIfEmpty(dbInstance);
  saveDb(dbInstance);

  return dbInstance;
}

function initTables(db: Database) {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT,
      age INTEGER NOT NULL,
      weight_kg REAL NOT NULL,
      fitness_goal TEXT NOT NULL,
      workout_intensity TEXT NOT NULL,
      fitness_level TEXT,
      profile_json TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS plans (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      version INTEGER NOT NULL DEFAULT 1,
      is_original INTEGER NOT NULL DEFAULT 1,
      parent_plan_id TEXT,
      plan_title TEXT NOT NULL,
      workout_intensity TEXT NOT NULL,
      quick_nutrition_recovery_tip TEXT,
      plan_json TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS feedbacks (
      id TEXT PRIMARY KEY,
      plan_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      feedback_text TEXT NOT NULL,
      rating INTEGER,
      changes_summary TEXT,
      created_at TEXT NOT NULL
    );
  `);
}

function seedIfEmpty(db: Database) {
  try {
    const res = db.exec('SELECT count(*) as count FROM users');
    const userCount = res.length > 0 && res[0].values[0] ? Number(res[0].values[0][0]) : 0;
    if (userCount > 0) return;

    const now = new Date().toISOString();
    const twoDaysAgo = new Date(Date.now() - 2 * 86400000).toISOString();
    const fourDaysAgo = new Date(Date.now() - 4 * 86400000).toISOString();

    // 1. Seed Alex Rivera
    db.run(
      `INSERT INTO users (id, name, email, age, weight_kg, fitness_goal, workout_intensity, fitness_level, profile_json, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        DEFAULT_USER_PROFILE.id,
        DEFAULT_USER_PROFILE.name,
        DEFAULT_USER_PROFILE.email || 'alex.rivera@fitbuddy.ai',
        DEFAULT_USER_PROFILE.age,
        DEFAULT_USER_PROFILE.weightKg,
        DEFAULT_USER_PROFILE.primaryGoal,
        DEFAULT_USER_PROFILE.workoutIntensity,
        DEFAULT_USER_PROFILE.fitnessLevel,
        JSON.stringify(DEFAULT_USER_PROFILE),
        fourDaysAgo,
        now,
      ]
    );

    // Seed Original Plan v1 for Alex
    db.run(
      `INSERT INTO plans (id, user_id, version, is_original, parent_plan_id, plan_title, workout_intensity, quick_nutrition_recovery_tip, plan_json, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'plan-alex-v1',
        DEFAULT_USER_PROFILE.id,
        1,
        1,
        null,
        'Titan 7-Day Hypertrophy & Kinetic Conditioning Architecture (Original)',
        'moderate',
        'Consume 35-40g high-quality whey isolate or lean poultry with 60g complex carbs within 45 minutes of lifting, and drink 3.2L water with trace electrolytes.',
        JSON.stringify({ ...INITIAL_FITNESS_PLAN, id: 'plan-alex-v1', version: 1, isOriginal: true }),
        fourDaysAgo,
        fourDaysAgo,
      ]
    );

    // Seed Feedback for Alex
    db.run(
      `INSERT INTO feedbacks (id, plan_id, user_id, feedback_text, rating, changes_summary, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        'fb-alex-1',
        'plan-alex-v1',
        DEFAULT_USER_PROFILE.id,
        'Day 2 squats caused mild lower back fatigue, please substitute with goblet squats and increase arm work on Day 4.',
        5,
        'Substituted Barbell Squat with Elevated Goblet Squats; added Incline Bicep Curls and increased rest between heavy sets.',
        twoDaysAgo,
      ]
    );

    // Seed Updated Plan v2 for Alex
    const updatedPlanV2 = {
      ...INITIAL_FITNESS_PLAN,
      id: 'plan-alex-v2',
      version: 2,
      isOriginal: false,
      parentPlanId: 'plan-alex-v1',
      planTitle: 'Titan 7-Day Hypertrophy Split (Updated v2)',
      feedbackHistory: [
        {
          feedbackText: 'Day 2 squats caused mild lower back fatigue, please substitute with goblet squats and increase arm work on Day 4.',
          submittedAt: twoDaysAgo,
          changesSummary: 'Substituted Barbell Squat with Elevated Goblet Squats; added Incline Bicep Curls and increased rest between heavy sets.',
        },
      ],
    };

    db.run(
      `INSERT INTO plans (id, user_id, version, is_original, parent_plan_id, plan_title, workout_intensity, quick_nutrition_recovery_tip, plan_json, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'plan-alex-v2',
        DEFAULT_USER_PROFILE.id,
        2,
        0,
        'plan-alex-v1',
        updatedPlanV2.planTitle,
        'moderate',
        'Prioritize 40g casein before sleep for sustained nighttime muscle protein synthesis, with 500ml water and electrolytes.',
        JSON.stringify(updatedPlanV2),
        twoDaysAgo,
        now,
      ]
    );

    // 2. Seed Maya Chen (High Intensity Athlete)
    const mayaProfile = {
      id: 'usr-maya-chen',
      name: 'Maya Chen',
      email: 'maya.chen@athlete.io',
      age: 25,
      weightKg: 62,
      fitnessGoal: 'weight_loss',
      workoutIntensity: 'high',
      fitnessLevel: 'advanced',
    };
    db.run(
      `INSERT INTO users (id, name, email, age, weight_kg, fitness_goal, workout_intensity, fitness_level, profile_json, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        mayaProfile.id,
        mayaProfile.name,
        mayaProfile.email,
        mayaProfile.age,
        mayaProfile.weightKg,
        mayaProfile.fitnessGoal,
        mayaProfile.workoutIntensity,
        mayaProfile.fitnessLevel,
        JSON.stringify(mayaProfile),
        threeDaysAgo(3),
        threeDaysAgo(3),
      ]
    );

    db.run(
      `INSERT INTO plans (id, user_id, version, is_original, parent_plan_id, plan_title, workout_intensity, quick_nutrition_recovery_tip, plan_json, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'plan-maya-v1',
        mayaProfile.id,
        1,
        1,
        null,
        '7-Day High-Intensity Metabolic Shred & EPOC Ignition',
        'high',
        'Fast-acting electrolytes (magnesium + sodium) immediately post-metabolic circuit, paired with 25g plant protein.',
        JSON.stringify({
          id: 'plan-maya-v1',
          planTitle: '7-Day High-Intensity Metabolic Shred & EPOC Ignition',
          version: 1,
          isOriginal: true,
          planOverview: 'A high-intensity interval conditioning and core endurance structure designed to maximize post-exercise oxygen consumption.',
          workoutIntensity: 'high',
          quickNutritionRecoveryTip: 'Fast-acting electrolytes immediately post-circuit, paired with 25g plant protein.',
          days: INITIAL_FITNESS_PLAN.days,
        }),
        threeDaysAgo(3),
        threeDaysAgo(3),
      ]
    );
  } catch (err) {
    console.warn('Seeding warning:', err);
  }
}

function threeDaysAgo(days: number) {
  return new Date(Date.now() - days * 86400000).toISOString();
}

export function saveDb(db?: Database) {
  const targetDb = db || dbInstance;
  if (!targetDb) return;
  const data = targetDb.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_PATH, buffer);
}

// User CRUD Helpers
export async function saveUserToDb(user: {
  id: string;
  name: string;
  email?: string;
  age: number;
  weightKg: number;
  fitnessGoal: string;
  workoutIntensity: string;
  fitnessLevel?: string;
  profileJson: string;
}) {
  const db = await getDb();
  const now = new Date().toISOString();

  // Check if user exists
  const stmt = db.prepare('SELECT id FROM users WHERE id = ?');
  stmt.bind([user.id]);
  const exists = stmt.step();
  stmt.free();

  if (exists) {
    db.run(
      `UPDATE users SET
        name = ?,
        email = ?,
        age = ?,
        weight_kg = ?,
        fitness_goal = ?,
        workout_intensity = ?,
        fitness_level = ?,
        profile_json = ?,
        updated_at = ?
      WHERE id = ?`,
      [
        user.name,
        user.email || '',
        user.age,
        user.weightKg,
        user.fitnessGoal,
        user.workoutIntensity,
        user.fitnessLevel || 'intermediate',
        user.profileJson,
        now,
        user.id,
      ]
    );
  } else {
    db.run(
      `INSERT INTO users (
        id, name, email, age, weight_kg, fitness_goal, workout_intensity, fitness_level, profile_json, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user.id,
        user.name,
        user.email || '',
        user.age,
        user.weightKg,
        user.fitnessGoal,
        user.workoutIntensity,
        user.fitnessLevel || 'intermediate',
        user.profileJson,
        now,
        now,
      ]
    );
  }
  saveDb(db);
}

// Plan CRUD Helpers
export async function savePlanToDb(plan: {
  id: string;
  userId: string;
  version: number;
  isOriginal: boolean;
  parentPlanId?: string;
  planTitle: string;
  workoutIntensity: string;
  quickNutritionRecoveryTip: string;
  planJson: string;
}) {
  const db = await getDb();
  const now = new Date().toISOString();

  db.run(
    `INSERT OR REPLACE INTO plans (
      id, user_id, version, is_original, parent_plan_id, plan_title, workout_intensity, quick_nutrition_recovery_tip, plan_json, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      plan.id,
      plan.userId,
      plan.version,
      plan.isOriginal ? 1 : 0,
      plan.parentPlanId || null,
      plan.planTitle,
      plan.workoutIntensity,
      plan.quickNutritionRecoveryTip,
      plan.planJson,
      now,
      now,
    ]
  );
  saveDb(db);
}

// Feedback Helper
export async function saveFeedbackToDb(feedback: {
  id: string;
  planId: string;
  userId: string;
  feedbackText: string;
  rating?: number;
  changesSummary?: string;
}) {
  const db = await getDb();
  const now = new Date().toISOString();

  db.run(
    `INSERT INTO feedbacks (
      id, plan_id, user_id, feedback_text, rating, changes_summary, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      feedback.id,
      feedback.planId,
      feedback.userId,
      feedback.feedbackText,
      feedback.rating || null,
      feedback.changesSummary || '',
      now,
    ]
  );
  saveDb(db);
}

// Admin Queries
export async function getAllUsersFromDb() {
  const db = await getDb();
  const res = db.exec(`
    SELECT
      u.id,
      u.name,
      u.email,
      u.age,
      u.weight_kg,
      u.fitness_goal,
      u.workout_intensity,
      u.fitness_level,
      u.created_at,
      COUNT(p.id) as plan_count,
      MAX(p.version) as latest_version
    FROM users u
    LEFT JOIN plans p ON u.id = p.user_id
    GROUP BY u.id
    ORDER BY u.created_at DESC
  `);

  if (!res.length) return [];
  const columns = res[0].columns;
  return res[0].values.map((row) => {
    const obj: any = {};
    columns.forEach((col, i) => {
      obj[col] = row[i];
    });
    return {
      id: obj.id,
      name: obj.name,
      email: obj.email,
      age: obj.age,
      weightKg: obj.weight_kg,
      fitnessGoal: obj.fitness_goal,
      workoutIntensity: obj.workout_intensity,
      fitnessLevel: obj.fitness_level,
      createdAt: obj.created_at,
      planCount: Number(obj.plan_count) || 0,
      latestPlanVersion: Number(obj.latest_version) || 1,
      hasUpdates: (Number(obj.plan_count) || 0) > 1,
    };
  });
}

export async function getUserPlansFromDb(userId: string) {
  const db = await getDb();
  const stmt = db.prepare(`
    SELECT id, user_id, version, is_original, parent_plan_id, plan_title, workout_intensity, quick_nutrition_recovery_tip, plan_json, created_at
    FROM plans
    WHERE user_id = ?
    ORDER BY version ASC, created_at ASC
  `);
  stmt.bind([userId]);

  const plans = [];
  while (stmt.step()) {
    const row = stmt.getAsObject();
    try {
      const parsedPlan = JSON.parse(row.plan_json as string);
      plans.push({
        ...parsedPlan,
        id: row.id,
        userId: row.user_id,
        version: row.version,
        isOriginal: Boolean(row.is_original),
        parentPlanId: row.parent_plan_id,
        workoutIntensity: row.workout_intensity,
        quickNutritionRecoveryTip: row.quick_nutrition_recovery_tip,
        createdAt: row.created_at,
      });
    } catch (e) {
      console.error('Failed to parse plan json', e);
    }
  }
  stmt.free();
  return plans;
}

export async function getAllPlansFromDb() {
  const db = await getDb();
  const res = db.exec(`
    SELECT p.id, p.user_id, p.version, p.is_original, p.parent_plan_id, p.plan_title, p.workout_intensity, p.quick_nutrition_recovery_tip, p.plan_json, p.created_at, u.name as user_name, u.age, u.weight_kg, u.fitness_goal
    FROM plans p
    JOIN users u ON p.user_id = u.id
    ORDER BY p.created_at DESC
  `);

  if (!res.length) return [];
  const columns = res[0].columns;
  return res[0].values.map((row) => {
    const obj: any = {};
    columns.forEach((col, i) => {
      obj[col] = row[i];
    });
    let parsedPlan = {};
    try {
      parsedPlan = JSON.parse(obj.plan_json);
    } catch {}
    return {
      ...parsedPlan,
      id: obj.id,
      userId: obj.user_id,
      userName: obj.user_name,
      userAge: obj.age,
      userWeight: obj.weight_kg,
      fitnessGoal: obj.fitness_goal,
      version: obj.version,
      isOriginal: Boolean(obj.is_original),
      parentPlanId: obj.parent_plan_id,
      planTitle: obj.plan_title,
      workoutIntensity: obj.workout_intensity,
      quickNutritionRecoveryTip: obj.quick_nutrition_recovery_tip,
      createdAt: obj.created_at,
    };
  });
}

export async function getFeedbacksFromDb() {
  const db = await getDb();
  const res = db.exec(`
    SELECT f.id, f.plan_id, f.user_id, f.feedback_text, f.rating, f.changes_summary, f.created_at, u.name as user_name
    FROM feedbacks f
    LEFT JOIN users u ON f.user_id = u.id
    ORDER BY f.created_at DESC
  `);

  if (!res.length) return [];
  const columns = res[0].columns;
  return res[0].values.map((row) => {
    const obj: any = {};
    columns.forEach((col, i) => {
      obj[col] = row[i];
    });
    return obj;
  });
}
