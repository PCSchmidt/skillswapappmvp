/**
 * Password Security Flow Test
 * 
 * Tests the new password audit and forced reset functionality
 */

const { auditPasswordStrength } = require('./src/lib/auth/passwordAudit.ts');

console.log('🔒 Testing Password Security Implementation...\n');

// Test 1: Weak password detection
console.log('Test 1: Weak Password Detection');
const weakPasswords = ['password', '123456', 'qwerty', 'password123'];
weakPasswords.forEach(pwd => {
  try {
    const audit = auditPasswordStrength(pwd, 'test@example.com');
    console.log(`  "${pwd}": ${audit.requiresReset ? '❌ BLOCKED' : '✅ ALLOWED'} (Score: ${audit.strengthScore})`);
  } catch (error) {
    console.log(`  "${pwd}": ⚠️ ERROR - ${error.message}`);
  }
});

console.log('\nTest 2: Strong Password Validation');
const strongPasswords = ['MySecureP@ssw0rd123!', 'Tr0ub4dor&3Complex!', 'G00d$trongP@ssword'];
strongPasswords.forEach(pwd => {
  try {
    const audit = auditPasswordStrength(pwd, 'test@example.com');
    console.log(`  "${pwd}": ${audit.requiresReset ? '❌ BLOCKED' : '✅ ALLOWED'} (Score: ${audit.strengthScore})`);
  } catch (error) {
    console.log(`  "${pwd}": ⚠️ ERROR - ${error.message}`);
  }
});

console.log('\nTest 3: Owner Account Specific Test');
try {
  const ownerPasswordAudit = auditPasswordStrength('password', 'paul.c.schmidt@gmail.com');
  console.log(`  Owner's "password": ${ownerPasswordAudit.requiresReset ? '❌ WILL BE FORCED TO RESET' : '✅ ALLOWED'}`);
  console.log(`  Reasons: ${ownerPasswordAudit.weaknessReasons.join(', ')}`);
} catch (error) {
  console.log(`  Owner test: ⚠️ ERROR - ${error.message}`);
}

console.log('\n🎉 Password Security Test Complete!');
