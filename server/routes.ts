import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { z } from "zod";
import { insertPatientSchema, insertStaffSchema, insertAppointmentSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Middleware to ensure user is authenticated
  const requireAuth = (req: any, res: any, next: any) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Unauthorized" });
  };

  // Patient routes
  app.get("/api/patients", requireAuth, async (req, res, next) => {
    try {
      const patients = await storage.getAllPatients();
      res.json(patients);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/patients/:id", requireAuth, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const patient = await storage.getPatient(id);
      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }
      res.json(patient);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/patients", requireAuth, async (req, res, next) => {
    try {
      const patientData = insertPatientSchema.parse(req.body);
      const patient = await storage.createPatient(patientData);
      res.status(201).json(patient);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation failed", errors: error.errors });
      }
      next(error);
    }
  });

  app.put("/api/patients/:id", requireAuth, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const patientData = insertPatientSchema.parse(req.body);
      const patient = await storage.updatePatient(id, patientData);
      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }
      res.json(patient);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation failed", errors: error.errors });
      }
      next(error);
    }
  });

  app.delete("/api/patients/:id", requireAuth, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deletePatient(id);
      if (!success) {
        return res.status(404).json({ message: "Patient not found" });
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });

  // Staff routes
  app.get("/api/staff", requireAuth, async (req, res, next) => {
    try {
      const staffMembers = await storage.getAllStaff();
      res.json(staffMembers);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/staff/:id", requireAuth, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const staff = await storage.getStaff(id);
      if (!staff) {
        return res.status(404).json({ message: "Staff not found" });
      }
      res.json(staff);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/staff", requireAuth, async (req, res, next) => {
    try {
      const staffData = insertStaffSchema.parse(req.body);
      const staff = await storage.createStaff(staffData);
      res.status(201).json(staff);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation failed", errors: error.errors });
      }
      next(error);
    }
  });

  app.put("/api/staff/:id", requireAuth, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const staffData = insertStaffSchema.parse(req.body);
      const staff = await storage.updateStaff(id, staffData);
      if (!staff) {
        return res.status(404).json({ message: "Staff not found" });
      }
      res.json(staff);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation failed", errors: error.errors });
      }
      next(error);
    }
  });

  app.delete("/api/staff/:id", requireAuth, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteStaff(id);
      if (!success) {
        return res.status(404).json({ message: "Staff not found" });
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });

  // Appointment routes
  app.get("/api/appointments", requireAuth, async (req, res, next) => {
    try {
      const appointments = await storage.getAllAppointments();
      res.json(appointments);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/appointments/today", requireAuth, async (req, res, next) => {
    try {
      const appointments = await storage.getTodayAppointments();
      res.json(appointments);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/appointments/:id", requireAuth, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const appointment = await storage.getAppointment(id);
      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }
      res.json(appointment);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/appointments", requireAuth, async (req, res, next) => {
    try {
      const appointmentData = insertAppointmentSchema.parse({
        ...req.body,
        createdById: req.user?.id
      });
      const appointment = await storage.createAppointment(appointmentData);
      res.status(201).json(appointment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation failed", errors: error.errors });
      }
      next(error);
    }
  });

  app.put("/api/appointments/:id", requireAuth, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const appointmentData = insertAppointmentSchema.omit({ createdById: true }).parse(req.body);
      const appointment = await storage.updateAppointment(id, appointmentData);
      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }
      res.json(appointment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation failed", errors: error.errors });
      }
      next(error);
    }
  });

  app.delete("/api/appointments/:id", requireAuth, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteAppointment(id);
      if (!success) {
        return res.status(404).json({ message: "Appointment not found" });
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });

  // Dashboard stats
  app.get("/api/stats", requireAuth, async (req, res, next) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      next(error);
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
