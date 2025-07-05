import { validateTaskData, validateStatus } from '../validationUtils';
import { VALIDATION_LIMITS } from '../../constants/taskConstants';

describe('validationUtils', () => {
  describe('validateTaskData', () => {
    describe('Required Field Validation', () => {
      test('returns error when title is missing', () => {
        const taskData = {
          title: '',
          description: 'Valid description'
        };
        
        const result = validateTaskData(taskData);
        
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Title is required');
        expect(result.errors).toHaveLength(1);
      });

      test('returns error when title is only whitespace', () => {
        const taskData = {
          title: '   ',
          description: 'Valid description'
        };
        
        const result = validateTaskData(taskData);
        
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Title is required');
        expect(result.errors).toHaveLength(1);
      });

      test('returns error when description is missing', () => {
        const taskData = {
          title: 'Valid title',
          description: ''
        };
        
        const result = validateTaskData(taskData);
        
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Description is required');
        expect(result.errors).toHaveLength(1);
      });

      test('returns error when description is only whitespace', () => {
        const taskData = {
          title: 'Valid title',
          description: '   '
        };
        
        const result = validateTaskData(taskData);
        
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Description is required');
        expect(result.errors).toHaveLength(1);
      });

      test('returns multiple errors when both title and description are missing', () => {
        const taskData = {
          title: '',
          description: ''
        };
        
        const result = validateTaskData(taskData);
        
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Title is required');
        expect(result.errors).toContain('Description is required');
        expect(result.errors).toHaveLength(2);
      });

      test('returns multiple errors when both title and description are only whitespace', () => {
        const taskData = {
          title: '   ',
          description: '   '
        };
        
        const result = validateTaskData(taskData);
        
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Title is required');
        expect(result.errors).toContain('Description is required');
        expect(result.errors).toHaveLength(2);
      });
    });

    describe('Length Validation', () => {
      test('returns error when title exceeds maximum length', () => {
        const longTitle = 'A'.repeat(VALIDATION_LIMITS.TITLE_MAX_LENGTH + 1);
        const taskData = {
          title: longTitle,
          description: 'Valid description'
        };
        
        const result = validateTaskData(taskData);
        
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain(`Title is too long (max ${VALIDATION_LIMITS.TITLE_MAX_LENGTH} characters)`);
        expect(result.errors).toHaveLength(1);
      });

      test('returns error when description exceeds maximum length', () => {
        const longDescription = 'A'.repeat(VALIDATION_LIMITS.DESCRIPTION_MAX_LENGTH + 1);
        const taskData = {
          title: 'Valid title',
          description: longDescription
        };
        
        const result = validateTaskData(taskData);
        
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain(`Description is too long (max ${VALIDATION_LIMITS.DESCRIPTION_MAX_LENGTH} characters)`);
        expect(result.errors).toHaveLength(1);
      });

      test('accepts title at maximum length', () => {
        const maxLengthTitle = 'A'.repeat(VALIDATION_LIMITS.TITLE_MAX_LENGTH);
        const taskData = {
          title: maxLengthTitle,
          description: 'Valid description'
        };
        
        const result = validateTaskData(taskData);
        
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      test('accepts description at maximum length', () => {
        const maxLengthDescription = 'A'.repeat(VALIDATION_LIMITS.DESCRIPTION_MAX_LENGTH);
        const taskData = {
          title: 'Valid title',
          description: maxLengthDescription
        };
        
        const result = validateTaskData(taskData);
        
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      test('returns multiple errors when both title and description exceed limits', () => {
        const longTitle = 'A'.repeat(VALIDATION_LIMITS.TITLE_MAX_LENGTH + 1);
        const longDescription = 'A'.repeat(VALIDATION_LIMITS.DESCRIPTION_MAX_LENGTH + 1);
        const taskData = {
          title: longTitle,
          description: longDescription
        };
        
        const result = validateTaskData(taskData);
        
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain(`Title is too long (max ${VALIDATION_LIMITS.TITLE_MAX_LENGTH} characters)`);
        expect(result.errors).toContain(`Description is too long (max ${VALIDATION_LIMITS.DESCRIPTION_MAX_LENGTH} characters)`);
        expect(result.errors).toHaveLength(2);
      });
    });

    describe('Valid Data', () => {
      test('returns valid for proper task data', () => {
        const taskData = {
          title: 'Valid Title',
          description: 'Valid Description'
        };
        
        const result = validateTaskData(taskData);
        
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      test('returns valid for task data with whitespace that will be trimmed', () => {
        const taskData = {
          title: '  Valid Title  ',
          description: '  Valid Description  '
        };
        
        const result = validateTaskData(taskData);
        
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      test('returns valid for minimal valid data', () => {
        const taskData = {
          title: 'A',
          description: 'B'
        };
        
        const result = validateTaskData(taskData);
        
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });
    });

    describe('Edge Cases', () => {
      test('handles null values gracefully', () => {
        const taskData = {
          title: null,
          description: null
        };
        
        const result = validateTaskData(taskData);
        
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Title is required');
        expect(result.errors).toContain('Description is required');
        expect(result.errors).toHaveLength(2);
      });

      test('handles undefined values gracefully', () => {
        const taskData = {
          title: undefined,
          description: undefined
        };
        
        const result = validateTaskData(taskData);
        
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Title is required');
        expect(result.errors).toContain('Description is required');
        expect(result.errors).toHaveLength(2);
      });

      test('handles missing properties gracefully', () => {
        const taskData = {};
        
        const result = validateTaskData(taskData);
        
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Title is required');
        expect(result.errors).toContain('Description is required');
        expect(result.errors).toHaveLength(2);
      });

      test('handles non-string values', () => {
        const taskData = {
          title: 123,
          description: true
        };
        
        const result = validateTaskData(taskData);
        
        // Should still validate as these can be converted to strings
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      test('handles special characters and unicode', () => {
        const taskData = {
          title: 'Special chars: !@#$%^&*()_+-=[]{}|;:,.<>?',
          description: 'Unicode: 🚀🌟🎉中文日本語한국어'
        };
        
        const result = validateTaskData(taskData);
        
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });
    });
  });

  describe('validateStatus', () => {
    test('returns true for valid status: active', () => {
      expect(validateStatus('active')).toBe(true);
    });

    test('returns true for valid status: completed', () => {
      expect(validateStatus('completed')).toBe(true);
    });

    test('returns true for valid status: deleted', () => {
      expect(validateStatus('deleted')).toBe(true);
    });

    test('returns false for invalid status: pending', () => {
      expect(validateStatus('pending')).toBe(false);
    });

    test('returns false for invalid status: archived', () => {
      expect(validateStatus('archived')).toBe(false);
    });

    test('returns false for empty string', () => {
      expect(validateStatus('')).toBe(false);
    });

    test('returns false for null', () => {
      expect(validateStatus(null)).toBe(false);
    });

    test('returns false for undefined', () => {
      expect(validateStatus(undefined)).toBe(false);
    });

    test('returns false for case-sensitive mismatches', () => {
      expect(validateStatus('Active')).toBe(false);
      expect(validateStatus('COMPLETED')).toBe(false);
      expect(validateStatus('Deleted')).toBe(false);
    });

    test('returns false for whitespace-only strings', () => {
      expect(validateStatus('   ')).toBe(false);
    });

    test('returns false for numbers', () => {
      expect(validateStatus(1)).toBe(false);
      expect(validateStatus(0)).toBe(false);
    });

    test('returns false for boolean values', () => {
      expect(validateStatus(true)).toBe(false);
      expect(validateStatus(false)).toBe(false);
    });

    test('returns false for objects', () => {
      expect(validateStatus({})).toBe(false);
      expect(validateStatus({ status: 'active' })).toBe(false);
    });

    test('returns false for arrays', () => {
      expect(validateStatus([])).toBe(false);
      expect(validateStatus(['active'])).toBe(false);
    });
  });
}); 