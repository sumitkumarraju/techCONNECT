import { NextResponse } from "next/server";
import { ZodError } from "zod";

export class ApiError extends Error {
    statusCode: number;
    details?: any;

    constructor(message: string, statusCode = 500, details?: any) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
    }
}

export function handleApiError(error: unknown) {
    console.error("❌ API Error:", error);

    if (error instanceof ApiError) {
        return NextResponse.json(
            { error: error.message, details: error.details },
            { status: error.statusCode }
        );
    }

    if (error instanceof ZodError) {
        return NextResponse.json(
            { error: "Validation Failed", details: error.format() },
            { status: 400 }
        );
    }

    if (error instanceof Error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }

    return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
    );
}
