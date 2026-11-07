/**
 * EduPulse Deterministic Rule-Based Early Warning Engine
 * Evaluates Attendance & Academic CGPA to compute student risk levels: SAFE, WARNING, CRITICAL
 * Department of Computer Science & Engineering, Metropolitan University
 * Strictly NO AI/ML models per academic specification.
 */

export type RiskLevel = 'SAFE' | 'WARNING' | 'CRITICAL';

export interface RiskEvaluationResult {
  riskLevel: RiskLevel;
  attendanceRisk: RiskLevel;
  academicRisk: RiskLevel;
  attendancePercentage: number;
  cgpa: number;
  factors: string[];
}

/**
 * Evaluate attendance threshold
 * >= 80.00% -> SAFE
 * 70.00% - 79.99% -> WARNING
 * < 70.00% -> CRITICAL
 */
export function evaluateAttendanceRisk(attendancePercentage: number): RiskLevel {
  if (attendancePercentage >= 80.0) return 'SAFE';
  if (attendancePercentage >= 70.0) return 'WARNING';
  return 'CRITICAL';
}

/**
 * Evaluate CGPA threshold
 * >= 3.00 -> SAFE
 * 2.50 - 2.99 -> WARNING
 * < 2.50 -> CRITICAL
 */
export function evaluateAcademicRisk(cgpa: number): RiskLevel {
  if (cgpa >= 3.0) return 'SAFE';
  if (cgpa >= 2.5) return 'WARNING';
  return 'CRITICAL';
}

const RISK_WEIGHTS: Record<RiskLevel, number> = {
  SAFE: 1,
  WARNING: 2,
  CRITICAL: 3
};

/**
 * Combine attendance & academic risks: If they disagree, use the worse risk level!
 */
export function computeCombinedRisk(attendancePercentage: number, cgpa: number): RiskEvaluationResult {
  const attendanceRisk = evaluateAttendanceRisk(attendancePercentage);
  const academicRisk = evaluateAcademicRisk(cgpa);

  const factors: string[] = [];

  if (attendanceRisk === 'CRITICAL') {
    factors.push(`Severe attendance deficit (${attendancePercentage.toFixed(1)}% < 70.0%)`);
  } else if (attendanceRisk === 'WARNING') {
    factors.push(`Attendance borderline (${attendancePercentage.toFixed(1)}% < 80.0%)`);
  }

  if (academicRisk === 'CRITICAL') {
    factors.push(`Critical academic performance (CGPA ${cgpa.toFixed(2)} < 2.50)`);
  } else if (academicRisk === 'WARNING') {
    factors.push(`Academic probation warning (CGPA ${cgpa.toFixed(2)} < 3.00)`);
  }

  const worstWeight = Math.max(RISK_WEIGHTS[attendanceRisk], RISK_WEIGHTS[academicRisk]);
  let riskLevel: RiskLevel = 'SAFE';

  if (worstWeight === 3) {
    riskLevel = 'CRITICAL';
  } else if (worstWeight === 2) {
    riskLevel = 'WARNING';
  } else {
    riskLevel = 'SAFE';
    factors.push('Satisfactory academic and attendance metrics.');
  }

  return {
    riskLevel,
    attendanceRisk,
    academicRisk,
    attendancePercentage,
    cgpa,
    factors
  };
}
