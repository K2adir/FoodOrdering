import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { stripe } from "./stripe.ts";

export const createOrRetrieveProfile = async (req: Request) => {
    const supabaseClient = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_ANON_KEY") ?? "",
        {
            global: {
                headers: { Authorization: req.headers.get("Authorization")! },
            },
        },
    );
    // Now we can get the session or user object
    const {
        data: { user },
    } = await supabaseClient.auth.getUser();

    console.log(user);
    if (!user) throw new Error("No user found");

    const { data: profile, error } = await supabaseClient.from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    if (error || !profile) throw new Error("No profile found");
    console.log("profile", profile);

    if (profile.stripe_customer_id) {
        return profile.stripe_customer_id;
    }

    const customer = await stripe.customers.create({
        email: profile.email,
        metadata: {
            user_id: user.id,
            full_name: profile.full_name,
            avatar_url: profile.avatar_url,
        },
    });

    console.log("customer", customer);

    await supabaseClient.from("profiles")
        .update({ stripe_customer_id: customer.id })
        .eq("id", user.id);
    return customer.id;
};
