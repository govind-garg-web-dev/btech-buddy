"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Loader2,
    RefreshCw,
    ShieldCheck,
    GraduationCap,
    BookOpen,
    AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

type Subject = {
    code: string;
    name: string;
    internal: string;
    external: string;
    total: string;
    maxMarks: string;
    grade: string;
    status: string;
};

type SemesterResult = {
    semester: string;
    sgpa: string;
    totalCredits: string;
    subjects: Subject[];
};

type ResultData = {
    name: string;
    enrollment: string;
    programme: string;
    semesters: SemesterResult[];
};

export default function ResultPage() {
    const [enrollment, setEnrollment] = useState("");
    const [password, setPassword] = useState("");
    const [captchaText, setCaptchaText] = useState("");
    const [captchaImage, setCaptchaImage] = useState<string | null>(null);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [loadingCaptcha, setLoadingCaptcha] = useState(false);
    const [checking, setChecking] = useState(false);
    const [result, setResult] = useState<ResultData | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchCaptcha = useCallback(async () => {
        setLoadingCaptcha(true);
        setCaptchaImage(null);
        setCaptchaText("");
        try {
            const res = await fetch("/api/result/captcha");
            const data = await res.json();
            if (!res.ok) throw new Error(data.error ?? "Failed to load captcha");
            setCaptchaImage(data.captcha);
            setSessionId(data.sessionId);
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Could not reach IPU portal");
        } finally {
            setLoadingCaptcha(false);
        }
    }, []);

    const handleCheck = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!sessionId) {
            toast.error("Please load the captcha first.");
            return;
        }
        setChecking(true);
        setResult(null);
        setError(null);
        try {
            const res = await fetch("/api/result/check", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ enrollment, password, captchaText, sessionId }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error ?? "Failed to fetch result");
            if (data._debug) {
                console.log("[IPU Result Debug HTML]\n", data._debug);
            }
            setResult(data as ResultData);
        } catch (e) {
            const msg = e instanceof Error ? e.message : "Something went wrong";
            setError(msg);
            // Refresh captcha on failure so they can try again
            fetchCaptcha();
        } finally {
            setChecking(false);
        }
    };

    const gradeColor = (grade: string) => {
        const g = grade.toUpperCase();
        if (g === "O" || g === "A+") return "text-green-500 font-bold";
        if (g === "A") return "text-green-400 font-semibold";
        if (g === "B+" || g === "B") return "text-blue-400 font-semibold";
        if (g === "C" || g === "C+") return "text-yellow-500";
        if (g === "F" || g === "FAIL") return "text-red-500 font-bold";
        return "";
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="mx-auto max-w-4xl px-4 py-10">
                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="mb-3 flex items-center justify-center gap-2">
                        <GraduationCap className="h-8 w-8 text-primary" />
                        <h1 className="text-3xl font-bold">IPU Result Checker</h1>
                    </div>
                    <p className="text-muted-foreground">
                        Check your GGSIPU exam results instantly
                    </p>
                    <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                        <ShieldCheck className="h-3.5 w-3.5 text-green-500" />
                        Your credentials are sent directly to the GGSIPU server. We never store them.
                    </div>
                </div>

                {/* Form */}
                {!result && (
                    <Card className="mx-auto max-w-md shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg">Login to Check Result</CardTitle>
                            <CardDescription>
                                Use your GGSIPU Exam Portal credentials
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleCheck} className="flex flex-col gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <Label htmlFor="enrollment">Enrollment Number</Label>
                                    <Input
                                        id="enrollment"
                                        placeholder="e.g. 04819102721"
                                        value={enrollment}
                                        onChange={(e) => setEnrollment(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Your exam portal password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <Label>Captcha</Label>
                                    <div className="flex items-center gap-2">
                                        {captchaImage ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={captchaImage}
                                                alt="Captcha"
                                                className="h-12 rounded border bg-white"
                                            />
                                        ) : (
                                            <div className="flex h-12 flex-1 items-center justify-center rounded border bg-muted text-xs text-muted-foreground">
                                                Click refresh to load captcha
                                            </div>
                                        )}
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={fetchCaptcha}
                                            disabled={loadingCaptcha}
                                            title="Refresh captcha"
                                        >
                                            {loadingCaptcha ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <RefreshCw className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                    <Input
                                        placeholder="Enter captcha text"
                                        value={captchaText}
                                        onChange={(e) => setCaptchaText(e.target.value)}
                                        required
                                        disabled={!captchaImage}
                                    />
                                </div>

                                {error && (
                                    <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                                        {error}
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    disabled={checking || !captchaImage}
                                    className="w-full gap-2"
                                >
                                    {checking ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Fetching Results...
                                        </>
                                    ) : (
                                        <>
                                            <BookOpen className="h-4 w-4" />
                                            Check Result
                                        </>
                                    )}
                                </Button>

                                <p className="text-center text-xs text-muted-foreground">
                                    Not affiliated with GGSIPU. For official results, visit{" "}
                                    <a
                                        href="https://examweb.ggsipu.ac.in"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="underline"
                                    >
                                        examweb.ggsipu.ac.in
                                    </a>
                                </p>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* Results */}
                {result && (
                    <div className="flex flex-col gap-6">
                        {/* Student info */}
                        <Card className="shadow-sm">
                            <CardContent className="pt-5">
                                <div className="flex flex-wrap items-center justify-between gap-4">
                                    <div>
                                        <p className="text-xl font-bold">{result.name || "—"}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {result.enrollment || enrollment}
                                        </p>
                                        {result.programme && (
                                            <p className="text-sm text-muted-foreground">
                                                {result.programme}
                                            </p>
                                        )}
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setResult(null);
                                            setError(null);
                                            setCaptchaText("");
                                            fetchCaptcha();
                                        }}
                                    >
                                        Check Another
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* No data parsed */}
                        {result.semesters.length === 0 && (
                            <Card className="shadow-sm">
                                <CardContent className="py-10 text-center">
                                    <AlertCircle className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
                                    <p className="font-semibold">Login successful but could not parse results</p>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        The IPU portal may have updated its layout. Please visit{" "}
                                        <a
                                            href="https://examweb.ggsipu.ac.in"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="underline"
                                        >
                                            examweb.ggsipu.ac.in
                                        </a>{" "}
                                        directly.
                                    </p>
                                </CardContent>
                            </Card>
                        )}

                        {/* Semester tables */}
                        {result.semesters.map((sem, i) => (
                            <Card key={i} className="shadow-sm">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-base">
                                            {sem.semester}
                                        </CardTitle>
                                        <div className="flex items-center gap-3 text-sm">
                                            {sem.sgpa && (
                                                <Badge variant="secondary" className="text-sm">
                                                    SGPA: {sem.sgpa}
                                                </Badge>
                                            )}
                                            {sem.totalCredits && (
                                                <span className="text-muted-foreground">
                                                    Credits: {sem.totalCredits}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-24">Code</TableHead>
                                                    <TableHead>Subject</TableHead>
                                                    <TableHead className="text-center">IA</TableHead>
                                                    <TableHead className="text-center">External</TableHead>
                                                    <TableHead className="text-center">Total</TableHead>
                                                    <TableHead className="text-center">Max</TableHead>
                                                    <TableHead className="text-center">Grade</TableHead>
                                                    <TableHead className="text-center">Status</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {sem.subjects.map((sub, j) => (
                                                    <TableRow key={j}>
                                                        <TableCell className="font-mono text-xs">
                                                            {sub.code}
                                                        </TableCell>
                                                        <TableCell className="max-w-[200px]">
                                                            {sub.name}
                                                        </TableCell>
                                                        <TableCell className="text-center">{sub.internal}</TableCell>
                                                        <TableCell className="text-center">{sub.external}</TableCell>
                                                        <TableCell className="text-center font-semibold">
                                                            {sub.total}
                                                        </TableCell>
                                                        <TableCell className="text-center text-muted-foreground">
                                                            {sub.maxMarks}
                                                        </TableCell>
                                                        <TableCell
                                                            className={`text-center ${gradeColor(sub.grade)}`}
                                                        >
                                                            {sub.grade}
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            <Badge
                                                                variant={
                                                                    sub.status.toLowerCase().includes("pass")
                                                                        ? "secondary"
                                                                        : sub.status.toLowerCase().includes("fail")
                                                                        ? "destructive"
                                                                        : "outline"
                                                                }
                                                                className="text-xs"
                                                            >
                                                                {sub.status || "—"}
                                                            </Badge>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
