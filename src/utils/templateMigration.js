/**
 * Template Migration Utility
 *
 * Syncs frontend template definitions to the backend
 * Run this when:
 * 1. Creating new templates
 * 2. Updating existing template schemas
 * 3. Migrating old templates to new format
 */

import { templateApi } from '../lib/templateApi.js';
import { templates } from '../templates/index.js';

/**
 * Sync all templates from frontend to backend
 * @returns {Promise<Object>} Migration results
 */
export async function migrateAllTemplates() {
  console.log('🚀 Starting template migration...');
  console.log(`Found ${Object.keys(templates).length} templates to sync`);

  const results = await templateApi.syncAllTemplates(templates);

  return {
    success: results.every(r => r.success),
    results,
    summary: {
      total: results.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length
    }
  };
}

/**
 * Sync a single template by ID
 * @param {string} templateId - Template ID to sync
 * @returns {Promise<Object>} Sync result
 */
export async function migrateSingleTemplate(templateId) {
  console.log(`🔄 Syncing template: ${templateId}`);

  const template = templates[templateId];
  if (!template) {
    throw new Error(`Template ${templateId} not found in frontend definitions`);
  }

  try {
    const result = await templateApi.syncTemplateSchema(template);
    console.log(`✅ Successfully synced template: ${templateId}`);
    return { success: true, data: result };
  } catch (error) {
    console.error(`❌ Failed to sync template ${templateId}:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * Check if templates need migration
 * Compares frontend templates with backend templates
 * @returns {Promise<Object>} Comparison result
 */
export async function checkTemplatesNeedMigration() {
  try {
    console.log('🔍 Checking if templates need migration...');

    const frontendTemplateIds = Object.keys(templates);
    const backendTemplates = await templateApi.getTemplates();
    const backendTemplateIds = backendTemplates.map(t => t.templateId || t.id);

    const missingInBackend = frontendTemplateIds.filter(
      id => !backendTemplateIds.includes(id)
    );

    const extraInBackend = backendTemplateIds.filter(
      id => !frontendTemplateIds.includes(id)
    );

    const needsMigration = missingInBackend.length > 0;

    console.log('📊 Migration check results:', {
      frontendCount: frontendTemplateIds.length,
      backendCount: backendTemplateIds.length,
      missingInBackend,
      extraInBackend,
      needsMigration
    });

    return {
      needsMigration,
      frontendTemplates: frontendTemplateIds,
      backendTemplates: backendTemplateIds,
      missingInBackend,
      extraInBackend
    };
  } catch (error) {
    console.error('Error checking templates:', error);
    return {
      needsMigration: true, // Assume migration needed on error
      error: error.message
    };
  }
}

/**
 * Auto-migrate templates on app startup (optional)
 * Only migrates if templates are missing in backend
 */
export async function autoMigrateIfNeeded() {
  try {
    const check = await checkTemplatesNeedMigration();

    if (check.needsMigration) {
      console.log('⚠️ Templates need migration, syncing automatically...');
      const results = await migrateAllTemplates();

      if (results.success) {
        console.log('✅ Auto-migration completed successfully');
      } else {
        console.warn('⚠️ Auto-migration completed with errors:', results.summary);
      }

      return results;
    } else {
      console.log('✅ All templates are up to date');
      return { success: true, message: 'Templates up to date' };
    }
  } catch (error) {
    console.error('❌ Auto-migration failed:', error);
    return { success: false, error: error.message };
  }
}

// Expose migration functions to window for manual execution in console
if (typeof window !== 'undefined') {
  window.templateMigration = {
    migrateAll: migrateAllTemplates,
    migrateSingle: migrateSingleTemplate,
    checkStatus: checkTemplatesNeedMigration,
    autoMigrate: autoMigrateIfNeeded
  };

  console.log('💡 Template migration utilities available at window.templateMigration');
  console.log('   - window.templateMigration.migrateAll()');
  console.log('   - window.templateMigration.migrateSingle("echolon")');
  console.log('   - window.templateMigration.checkStatus()');
  console.log('   - window.templateMigration.autoMigrate()');
}

export default {
  migrateAllTemplates,
  migrateSingleTemplate,
  checkTemplatesNeedMigration,
  autoMigrateIfNeeded
};
