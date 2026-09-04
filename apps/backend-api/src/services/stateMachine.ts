export type ProjectStatusEnum = 
  | 'RECOMMENDED' 
  | 'IN_FEASIBILITY' 
  | 'SANCTIONED' 
  | 'REJECTED' 
  | 'AGENCY_ASSIGNED' 
  | 'IN_PROGRESS' 
  | 'COMPLETED' 
  | 'AUDITED' 
  | 'FROZEN_PENDING_AUDIT';

const ALLOWED_TRANSITIONS: Record<ProjectStatusEnum, ProjectStatusEnum[]> = {
  RECOMMENDED: ['IN_FEASIBILITY', 'SANCTIONED', 'REJECTED', 'FROZEN_PENDING_AUDIT'],
  IN_FEASIBILITY: ['SANCTIONED', 'REJECTED', 'FROZEN_PENDING_AUDIT'],
  SANCTIONED: ['AGENCY_ASSIGNED', 'IN_PROGRESS', 'REJECTED', 'FROZEN_PENDING_AUDIT'],
  AGENCY_ASSIGNED: ['IN_PROGRESS', 'REJECTED', 'FROZEN_PENDING_AUDIT'],
  IN_PROGRESS: ['COMPLETED', 'FROZEN_PENDING_AUDIT'],
  COMPLETED: ['AUDITED'],
  REJECTED: [],
  AUDITED: [],
  FROZEN_PENDING_AUDIT: ['IN_FEASIBILITY', 'SANCTIONED', 'REJECTED', 'IN_PROGRESS'],
};

export class ProjectStateMachine {
  /**
   * Evaluates if a state transition is valid according to MPLADS rules.
   */
  static canTransition(currentStatus: ProjectStatusEnum, nextStatus: ProjectStatusEnum): boolean {
    const allowed = ALLOWED_TRANSITIONS[currentStatus];
    return allowed ? allowed.includes(nextStatus) : false;
  }

  /**
   * Performs the state transition or throws a detailed validation error.
   */
  static validateTransition(currentStatus: ProjectStatusEnum, nextStatus: ProjectStatusEnum): void {
    if (!this.canTransition(currentStatus, nextStatus)) {
      throw new Error(
        `Illegal state transition attempt from '${currentStatus}' to '${nextStatus}'. Permitted transitions: [${ALLOWED_TRANSITIONS[currentStatus]?.join(', ') || 'None'}]`
      );
    }
  }
}
