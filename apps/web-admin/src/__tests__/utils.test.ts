import {
  cn,
  formatCurrency,
  formatDate,
  formatDateTime,
  formatPercentage,
  formatCompactNumber,
  calculateBusinessDaysRemaining,
  getInitials,
  truncate,
  downloadCsv,
} from '@/lib/utils';

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('handles conditional classes', () => {
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz');
  });

  it('merges tailwind conflicts (last wins)', () => {
    const result = cn('p-4', 'p-8');
    expect(result).toBe('p-8');
  });
});

describe('formatCurrency', () => {
  it('formats BRL currency', () => {
    const result = formatCurrency(1000);
    expect(result).toContain('1');
    expect(result).toContain('000');
    expect(result).toMatch(/R\$/);
  });

  it('formats zero', () => {
    expect(formatCurrency(0)).toMatch(/R\$/);
  });

  it('formats large values', () => {
    const result = formatCurrency(1500000.50);
    expect(result).toContain('1');
  });
});

describe('formatDate', () => {
  it('formats a date string', () => {
    const result = formatDate('2023-10-12');
    expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    expect(result).toContain('2023');
  });

  it('formats a Date object', () => {
    const result = formatDate(new Date('2023-11-15'));
    expect(result).toContain('2023');
  });
});

describe('formatDateTime', () => {
  it('includes date and time parts', () => {
    const result = formatDateTime('2023-10-12T14:30:00');
    expect(result).toContain('2023');
    expect(result).toMatch(/\d{2}:\d{2}/);
  });
});

describe('formatPercentage', () => {
  it('formats 100 as 100%', () => {
    const result = formatPercentage(100);
    expect(result).toContain('100');
    expect(result).toContain('%');
  });

  it('formats 50 as 50%', () => {
    const result = formatPercentage(50);
    expect(result).toContain('50');
  });

  it('formats decimal percentages', () => {
    const result = formatPercentage(12.5);
    expect(result).toContain('12');
  });
});

describe('formatCompactNumber', () => {
  it('formats millions', () => {
    expect(formatCompactNumber(1500000)).toBe('1.5M');
    expect(formatCompactNumber(2000000)).toBe('2.0M');
  });

  it('formats thousands', () => {
    expect(formatCompactNumber(1500)).toBe('1.5K');
    expect(formatCompactNumber(10000)).toBe('10.0K');
  });

  it('formats small numbers as-is', () => {
    expect(formatCompactNumber(999)).toBe('999');
    expect(formatCompactNumber(0)).toBe('0');
  });
});

describe('calculateBusinessDaysRemaining', () => {
  it('returns 0 for past dates', () => {
    const past = new Date();
    past.setDate(past.getDate() - 10);
    expect(calculateBusinessDaysRemaining(past)).toBe(0);
  });

  it('returns positive for future dates', () => {
    const future = new Date();
    future.setDate(future.getDate() + 14); // 2 weeks ahead
    const result = calculateBusinessDaysRemaining(future);
    expect(result).toBeGreaterThan(0);
    expect(result).toBeLessThanOrEqual(10);
  });
});

describe('getInitials', () => {
  it('gets first two initials', () => {
    expect(getInitials('João Silva')).toBe('JS');
  });

  it('handles single name', () => {
    expect(getInitials('João')).toBe('J');
  });

  it('handles three-part names (returns first 2)', () => {
    expect(getInitials('Maria da Silva')).toBe('MD');
  });

  it('uppercases initials', () => {
    expect(getInitials('joão silva')).toBe('JS');
  });
});

describe('truncate', () => {
  it('returns string unchanged if within length', () => {
    expect(truncate('hello', 10)).toBe('hello');
    expect(truncate('hello', 5)).toBe('hello');
  });

  it('truncates and adds ellipsis when exceeding length', () => {
    expect(truncate('hello world', 5)).toBe('hello...');
  });

  it('handles empty string', () => {
    expect(truncate('', 5)).toBe('');
  });
});

describe('downloadCsv', () => {
  it('creates and clicks a download link', () => {
    const mockClick = jest.fn();
    const mockCreateObjectURL = jest.fn(() => 'blob:url');
    const mockRevokeObjectURL = jest.fn();
    const mockLink = {
      href: '',
      download: '',
      click: mockClick,
    };

    jest.spyOn(document, 'createElement').mockReturnValue(mockLink as unknown as HTMLAnchorElement);
    URL.createObjectURL = mockCreateObjectURL;
    URL.revokeObjectURL = mockRevokeObjectURL;

    downloadCsv('a,b,c\n1,2,3', 'test.csv');

    expect(mockLink.download).toBe('test.csv');
    expect(mockClick).toHaveBeenCalled();
    expect(mockRevokeObjectURL).toHaveBeenCalled();

    jest.restoreAllMocks();
  });
});
