import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const reference = searchParams.get('reference');
        const singleChapter = searchParams.get('single_chapter');

        if (!reference) {
            return NextResponse.json(
                { error: "Missing reference parameter (ex: joel1:18 or joel1)" },
                { status: 400 }
            );
        }

        let apiUrl = `https://bible-api.com/${reference}?translation=almeida`;

        if (singleChapter === "true") {
            apiUrl += "&single_chapter_book_matching=indifferent";
        }

        const response = await fetch(apiUrl);

        if (!response.ok) {
            return NextResponse.json(
                { error: "Failed to fetch from Bible API" },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error", details: (error as Error).message },
            { status: 500 }
        )
    }

}