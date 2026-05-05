'use server';

import { auth } from "@/lib/better-auth/auth";
import { inngest } from "../inngest/client";
import { headers } from "next/headers";
import { success } from "better-auth";

export async function signUpWithEmail({
    email, 
    password, 
    fullName,
    country,
    investmentGoals,
    riskTolerance,
    preferredIndustry

}: SignUpFormData) {
    try {
        const response = await auth.api.signUpEmail({
            body: {
                email: email,
                password: password,
                name: fullName
            }
        })

        if (response) {
            try {
                await inngest.send({
                    name: 'app/user.created',
                    data: {
                        email: email,
                        name: fullName,
                        country: country,
                        investmentGoals: investmentGoals,
                        riskTolerance: riskTolerance,
                        preferredIndustry: preferredIndustry
                    }
                })
            } catch (inngestError) {
                console.error("Failed to send Inngest event:", inngestError)
            }
        }

        return { success: true, data: response }
    } catch (e) {
        console.log("Sign up failed", e)
        return { success: false, error: "Sign up failed"}
    }
}

export async function signOut() {
    try {
        await auth?.api.signOut({ headers: await headers()})
    } catch (e) {
        console.log("Sign out failed", e)
        return { success: false, error: "Sign out failed"}
    }
}

export async function signInWithEmail({email, password}: SignInFormData) {
    try {
        const response = await auth?.api.signInEmail({
            body: {
                email,
                password
            }
        })

        return { success: true, data: response}
    } catch (e) {
        console.log("Sign in failed")
        return { success: false, error: "Sign in failed"}
    }
}