"use server";

import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

// Definisikan aturan validasi menggunakan Zod
const contactSchema = z.object({
  name: z.string().min(2, { message: "Nama minimal harus 2 karakter." }),
  email: z.string().email({ message: "Format email tidak valid." }),
  message: z.string().min(10, { message: "Pesan minimal harus 10 karakter." }),
});

const resend = new Resend(process.env.RESEND_API_KEY);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function submitContactForm(formData: FormData) {
  // Ambil data dari form
  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  };

  // Validasi data menggunakan Zod schema
  const validatedFields = contactSchema.safeParse(rawData);

  if (!validatedFields.success) {
    // Ambil pesan error pertama dari Zod
    const errorMessage = validatedFields.error.issues[0].message;
    return { success: false, error: errorMessage };
  }

  const { name, email, message } = validatedFields.data;

  // 1. Simpan ke database Supabase
  const { error: dbError } = await supabase
    .from("messages")
    .insert([{ name, email, message }]);

  if (dbError) {
    console.error("Supabase Error:", dbError);
    return { success: false, error: "Gagal menyimpan pesan ke database." };
  }

  // 2. Kirim email notifikasi via Resend
  try {
    await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: "emil.aditia123@gmail.com",
      subject: `New Portfolio Message from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #9333ea;">Pesan Baru dari Website Portofolio</h2>
          <p><strong>Nama:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Pesan:</strong></p>
          <blockquote style="background: #f9f9f9; border-left: 4px solid #9333ea; padding: 10px; margin: 10px 0;">
            ${message}
          </blockquote>
          <p style="font-size: 12px; color: #666; margin-top: 20px;">Pesan divalidasi aman dengan Zod & dikirim otomatis.</p>
        </div>
      `,
    });
  } catch (emailError) {
    console.error("Resend Email Error:", emailError);
  }

  return { success: true };
}