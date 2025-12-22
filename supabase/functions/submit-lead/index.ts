import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface LeadData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  insuranceType: string;
  zipCode: string;
  source: string;
  timestamp: string;
  currentlyInsured?: string;
  homeowner?: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const data: LeadData = await req.json();

    // Store lead in database
    const { error: dbError } = await supabase.from("leads").insert({
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone: data.phone,
      insurance_type: data.insuranceType,
      zip_code: data.zipCode,
      source: data.source,
      currently_insured: data.currentlyInsured,
      homeowner: data.homeowner,
      created_at: data.timestamp,
    });

    if (dbError) {
      console.error("Database error:", dbError);
    }

    // Send email notification to Derrick
    if (resendApiKey) {
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(to right, #2563eb, #1d4ed8); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">New Lead from 805 Insurance</h1>
          </div>

          <div style="padding: 30px; background: #f9fafb;">
            <h2 style="color: #1f2937; margin-top: 0;">Contact Information</h2>

            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Name:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${data.firstName} ${data.lastName}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Phone:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #1f2937;">
                  <a href="tel:${data.phone}" style="color: #2563eb; text-decoration: none;">${data.phone}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Email:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #1f2937;">
                  ${data.email ? `<a href="mailto:${data.email}" style="color: #2563eb; text-decoration: none;">${data.email}</a>` : 'Not provided'}
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Insurance Type:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${data.insuranceType}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">ZIP Code:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${data.zipCode}</td>
              </tr>
              ${data.currentlyInsured ? `
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Currently Insured:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${data.currentlyInsured}</td>
              </tr>
              ` : ''}
              ${data.homeowner ? `
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Homeowner:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${data.homeowner}</td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 10px 0; font-weight: bold; color: #374151;">Source:</td>
                <td style="padding: 10px 0; color: #1f2937;">${data.source}</td>
              </tr>
            </table>

            <div style="margin-top: 30px; padding: 20px; background: #dbeafe; border-radius: 8px;">
              <p style="margin: 0; color: #1e40af; font-weight: bold;">Quick Actions:</p>
              <p style="margin: 10px 0 0 0;">
                <a href="tel:${data.phone}" style="display: inline-block; background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; margin-right: 10px;">Call Now</a>
                ${data.email ? `<a href="mailto:${data.email}" style="display: inline-block; background: #059669; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px;">Send Email</a>` : ''}
              </p>
            </div>
          </div>

          <div style="padding: 20px; background: #1f2937; text-align: center;">
            <p style="color: #9ca3af; margin: 0; font-size: 12px;">
              This lead was submitted on ${new Date(data.timestamp).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })} PST
            </p>
          </div>
        </div>
      `;

      const emailResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: "805 Insurance <leads@805insurance.com>",
          to: ["derrickbealer@gmail.com"],
          subject: `New ${data.insuranceType} Lead: ${data.firstName} ${data.lastName} - ${data.phone}`,
          html: emailHtml,
        }),
      });

      if (!emailResponse.ok) {
        const errorText = await emailResponse.text();
        console.error("Email send error:", errorText);
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
