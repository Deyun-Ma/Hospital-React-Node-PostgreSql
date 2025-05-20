import { users, patients, staff, appointments } from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte, sql } from "drizzle-orm";
import { startOfDay, endOfDay } from "date-fns";
import createMemoryStore from "memorystore";
import session from "express-session";
import { type User, type InsertUser, type Patient, type InsertPatient, type Staff, type InsertStaff, type Appointment, type InsertAppointment } from "@shared/schema";

const MemoryStore = createMemoryStore(session);

// Extending the IStorage interface with all required methods
export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Patients
  getAllPatients(): Promise<Patient[]>;
  getPatient(id: number): Promise<Patient | undefined>;
  createPatient(patient: InsertPatient): Promise<Patient>;
  updatePatient(id: number, patient: InsertPatient): Promise<Patient | undefined>;
  deletePatient(id: number): Promise<boolean>;
  
  // Staff
  getAllStaff(): Promise<(Staff & { user: User })[]>;
  getStaff(id: number): Promise<(Staff & { user: User }) | undefined>;
  createStaff(staff: InsertStaff): Promise<Staff & { user: User }>;
  updateStaff(id: number, staff: InsertStaff): Promise<Staff & { user: User } | undefined>;
  deleteStaff(id: number): Promise<boolean>;
  
  // Appointments
  getAllAppointments(): Promise<(Appointment & { patient: Patient, staff: Staff & { user: User } })[]>;
  getTodayAppointments(): Promise<(Appointment & { patient: Patient, staff: Staff & { user: User } })[]>;
  getAppointment(id: number): Promise<(Appointment & { patient: Patient, staff: Staff & { user: User } }) | undefined>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: number, appointment: Partial<InsertAppointment>): Promise<Appointment | undefined>;
  deleteAppointment(id: number): Promise<boolean>;
  
  // Stats
  getStats(): Promise<{
    patientCount: number;
    staffCount: number;
    appointmentCount: number;
    bedOccupancy: number;
  }>;
  
  // Session store
  sessionStore: any; // Use any type to avoid the SessionStore type issue
}

export class DatabaseStorage implements IStorage {
  sessionStore: any; // Using any type to avoid the SessionStore type issue
  
  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // 24 hours
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Patient methods
  async getAllPatients(): Promise<Patient[]> {
    return await db.select().from(patients).orderBy(patients.lastName);
  }

  async getPatient(id: number): Promise<Patient | undefined> {
    const [patient] = await db.select().from(patients).where(eq(patients.id, id));
    return patient;
  }

  async createPatient(insertPatient: InsertPatient): Promise<Patient> {
    const [patient] = await db
      .insert(patients)
      .values(insertPatient)
      .returning();
    return patient;
  }

  async updatePatient(id: number, patientData: InsertPatient): Promise<Patient | undefined> {
    const [patient] = await db
      .update(patients)
      .set(patientData)
      .where(eq(patients.id, id))
      .returning();
    return patient;
  }

  async deletePatient(id: number): Promise<boolean> {
    const result = await db
      .delete(patients)
      .where(eq(patients.id, id))
      .returning({ id: patients.id });
    return result.length > 0;
  }

  // Staff methods
  async getAllStaff(): Promise<(Staff & { user: User })[]> {
    return await db.query.staff.findMany({
      with: {
        user: true,
      },
      orderBy: (staff, { asc }) => [asc(staff.department)],
    });
  }

  async getStaff(id: number): Promise<(Staff & { user: User }) | undefined> {
    return await db.query.staff.findFirst({
      where: eq(staff.id, id),
      with: {
        user: true,
      },
    });
  }

  async createStaff(staffData: InsertStaff): Promise<Staff & { user: User }> {
    const [createdStaff] = await db
      .insert(staff)
      .values(staffData)
      .returning();
    
    const staffWithUser = await db.query.staff.findFirst({
      where: eq(staff.id, createdStaff.id),
      with: {
        user: true,
      },
    });
    
    if (!staffWithUser) {
      throw new Error("Failed to create staff");
    }
    
    return staffWithUser;
  }

  async updateStaff(id: number, staffData: InsertStaff): Promise<(Staff & { user: User }) | undefined> {
    const [updated] = await db
      .update(staff)
      .set(staffData)
      .where(eq(staff.id, id))
      .returning();
      
    if (!updated) {
      return undefined;
    }
    
    return await db.query.staff.findFirst({
      where: eq(staff.id, id),
      with: {
        user: true,
      },
    });
  }

  async deleteStaff(id: number): Promise<boolean> {
    const result = await db
      .delete(staff)
      .where(eq(staff.id, id))
      .returning({ id: staff.id });
    return result.length > 0;
  }

  // Appointment methods
  async getAllAppointments(): Promise<(Appointment & { patient: Patient, staff: Staff & { user: User } })[]> {
    return await db.query.appointments.findMany({
      with: {
        patient: true,
        staff: {
          with: {
            user: true,
          },
        },
      },
      orderBy: (appointments, { desc }) => [desc(appointments.scheduledFor)],
    });
  }

  async getTodayAppointments(): Promise<(Appointment & { patient: Patient, staff: Staff & { user: User } })[]> {
    const now = new Date();
    const startOfToday = startOfDay(now);
    const endOfToday = endOfDay(now);
    
    return await db.query.appointments.findMany({
      where: and(
        gte(appointments.scheduledFor, startOfToday),
        lte(appointments.scheduledFor, endOfToday)
      ),
      with: {
        patient: true,
        staff: {
          with: {
            user: true,
          },
        },
      },
      orderBy: (appointments, { asc }) => [asc(appointments.scheduledFor)],
    });
  }

  async getAppointment(id: number): Promise<(Appointment & { patient: Patient, staff: Staff & { user: User } }) | undefined> {
    return await db.query.appointments.findFirst({
      where: eq(appointments.id, id),
      with: {
        patient: true,
        staff: {
          with: {
            user: true,
          },
        },
      },
    });
  }

  async createAppointment(appointmentData: InsertAppointment): Promise<Appointment> {
    const [appointment] = await db
      .insert(appointments)
      .values(appointmentData)
      .returning();
    return appointment;
  }

  async updateAppointment(id: number, appointmentData: Partial<InsertAppointment>): Promise<Appointment | undefined> {
    const [appointment] = await db
      .update(appointments)
      .set(appointmentData)
      .where(eq(appointments.id, id))
      .returning();
    return appointment;
  }

  async deleteAppointment(id: number): Promise<boolean> {
    const result = await db
      .delete(appointments)
      .where(eq(appointments.id, id))
      .returning({ id: appointments.id });
    return result.length > 0;
  }

  // Stats methods
  async getStats(): Promise<{
    patientCount: number;
    staffCount: number;
    appointmentCount: number;
    bedOccupancy: number;
  }> {
    // Using SQL count(*) directly for more reliable counting
    const patientCountResult = await db
      .select({ count: sql`count(*)` })
      .from(patients);
    
    const staffCountResult = await db
      .select({ count: sql`count(*)` })
      .from(staff);
    
    const appointmentCountResult = await db
      .select({ count: sql`count(*)` })
      .from(appointments);
    
    // Safely parse count results, defaulting to 0 if invalid
    const patientCount = patientCountResult[0]?.count !== undefined 
      ? Number(patientCountResult[0].count) || 0 
      : 0;
      
    const staffCount = staffCountResult[0]?.count !== undefined 
      ? Number(staffCountResult[0].count) || 0 
      : 0;
      
    const appointmentCount = appointmentCountResult[0]?.count !== undefined 
      ? Number(appointmentCountResult[0].count) || 0 
      : 0;
    
    // Bed occupancy is a placeholder value in this implementation
    // In a real system, you would calculate this from bed/room occupancy data
    
    return {
      patientCount,
      staffCount,
      appointmentCount,
      bedOccupancy: 76, // Placeholder value
    };
  }
}

export const storage = new DatabaseStorage();
