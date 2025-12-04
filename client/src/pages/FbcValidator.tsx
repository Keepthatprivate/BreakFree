import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Check, X, Copy, Send, Info, RefreshCw, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ValidationResult {
  isValid: boolean;
  checks: {
    id: string;
    label: string;
    passed: boolean;
    message: string;
    tooltip: string;
  }[];
}

function validateFbc(fbc: string): ValidationResult {
  const checks = [];
  
  checks.push({
    id: "prefix",
    label: 'Starts with "fb.1."',
    passed: fbc.startsWith("fb.1."),
    message: fbc.startsWith("fb.1.") ? "Valid prefix" : 'Must start with "fb.1."',
    tooltip: "All fbc values must begin with 'fb.1.' to indicate the cookie version"
  });

  const parts = fbc.split(".");
  const hasValidStructure = parts.length >= 4;
  
  let timestamp = 0;
  let timestampValid = false;
  let timestampInRange = false;
  
  if (hasValidStructure && parts[2]) {
    const timestampStr = parts[2];
    const isThirteenDigits = /^\d{13}$/.test(timestampStr);
    timestamp = parseInt(timestampStr, 10);
    timestampValid = isThirteenDigits && !isNaN(timestamp);
    
    if (timestampValid) {
      const now = Date.now();
      const ninetyDaysAgo = now - (90 * 24 * 60 * 60 * 1000);
      timestampInRange = timestamp <= now && timestamp >= ninetyDaysAgo;
    }
  }

  checks.push({
    id: "timestamp_format",
    label: "Contains valid 13-digit timestamp",
    passed: timestampValid,
    message: timestampValid 
      ? `Timestamp: ${new Date(timestamp).toISOString()}` 
      : "Timestamp must be exactly 13 digits (milliseconds)",
    tooltip: "The timestamp should be a 13-digit Unix timestamp in milliseconds representing when the click occurred"
  });

  checks.push({
    id: "timestamp_range",
    label: "Timestamp is within valid range",
    passed: timestampInRange,
    message: timestampInRange 
      ? "Within 90-day window" 
      : timestampValid && timestamp > Date.now() 
        ? "Timestamp is in the future" 
        : "Timestamp is older than 90 days or invalid",
    tooltip: "Meta only accepts fbc values with timestamps not in the future and not older than 90 days"
  });

  const fbclidPart = hasValidStructure ? parts.slice(3).join(".") : "";
  const hasFbclid = fbclidPart.length > 0 && /^[a-zA-Z0-9_-]+$/.test(fbclidPart);
  
  checks.push({
    id: "fbclid",
    label: "Contains fbclid value after timestamp",
    passed: hasFbclid,
    message: hasFbclid 
      ? `fbclid: ${fbclidPart.substring(0, 20)}${fbclidPart.length > 20 ? "..." : ""}` 
      : "Missing or invalid fbclid value",
    tooltip: "The fbclid is the unique click identifier from the Facebook ad URL parameter"
  });

  const looksHashed = fbc.length === 64 && /^[a-f0-9]+$/.test(fbc);
  checks.push({
    id: "not_hashed",
    label: "Not hashed (fbc should never be hashed)",
    passed: !looksHashed,
    message: looksHashed 
      ? "Value appears to be SHA256 hashed - fbc must NOT be hashed!" 
      : "Not hashed (correct)",
    tooltip: "Unlike email/phone, the fbc parameter should be sent in its original format, never hashed"
  });

  const regexValid = /^fb\.1\.\d{13}\.[a-zA-Z0-9_-]+$/.test(fbc);
  
  return {
    isValid: checks.every(c => c.passed) && regexValid,
    checks
  };
}

function validateFbp(fbp: string): ValidationResult {
  const checks = [];
  
  checks.push({
    id: "prefix",
    label: 'Starts with "fb.1."',
    passed: fbp.startsWith("fb.1."),
    message: fbp.startsWith("fb.1.") ? "Valid prefix" : 'Must start with "fb.1."',
    tooltip: "All fbp values must begin with 'fb.1.' to indicate the cookie version"
  });

  const parts = fbp.split(".");
  const hasValidStructure = parts.length === 4;
  
  let timestamp = 0;
  let timestampValid = false;
  
  if (hasValidStructure && parts[2]) {
    const timestampStr = parts[2];
    const isThirteenDigits = /^\d{13}$/.test(timestampStr);
    timestamp = parseInt(timestampStr, 10);
    timestampValid = isThirteenDigits && !isNaN(timestamp);
  }

  checks.push({
    id: "timestamp_format",
    label: "Contains valid 13-digit timestamp",
    passed: timestampValid,
    message: timestampValid 
      ? `Created: ${new Date(timestamp).toISOString()}` 
      : "Timestamp must be exactly 13 digits (milliseconds)",
    tooltip: "The timestamp represents when the browser pixel cookie was first created"
  });

  const randomPart = hasValidStructure ? parts[3] : "";
  const hasRandomNumber = /^\d+$/.test(randomPart) && randomPart.length > 0;
  
  checks.push({
    id: "random_number",
    label: "Contains random number identifier",
    passed: hasRandomNumber,
    message: hasRandomNumber 
      ? `Random ID: ${randomPart}` 
      : "Missing or invalid random number",
    tooltip: "The fbp ends with a random number that uniquely identifies the browser"
  });

  const regexValid = /^fb\.1\.\d{13}\.\d+$/.test(fbp);
  
  return {
    isValid: checks.every(c => c.passed) && regexValid,
    checks
  };
}

function generateFbc(fbclid: string): string {
  const timestamp = Date.now();
  return `fb.1.${timestamp}.${fbclid}`;
}

export default function FbcValidator() {
  const { toast } = useToast();
  
  const [fbc, setFbc] = useState("");
  const [fbp, setFbp] = useState("");
  const [fbclid, setFbclid] = useState("");
  const [generatedFbc, setGeneratedFbc] = useState("");
  
  const [pixelId, setPixelId] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [testFbc, setTestFbc] = useState("");
  const [testFbp, setTestFbp] = useState("");
  const [testEventCode, setTestEventCode] = useState("TEST12345");
  const [eventSourceUrl, setEventSourceUrl] = useState("https://example.com");
  
  const [isSending, setIsSending] = useState(false);
  const [apiResponse, setApiResponse] = useState<any>(null);
  
  const fbcValidation = useMemo(() => validateFbc(fbc), [fbc]);
  const fbpValidation = useMemo(() => validateFbp(fbp), [fbp]);

  const handleGenerateFbc = () => {
    if (!fbclid.trim()) {
      toast({
        title: "Missing fbclid",
        description: "Please enter an fbclid value to generate fbc",
        variant: "destructive"
      });
      return;
    }
    const cleanFbclid = fbclid.trim().replace(/^fbclid=/, "");
    const generated = generateFbc(cleanFbclid);
    setGeneratedFbc(generated);
    toast({
      title: "fbc Generated",
      description: "Click copy to use the generated value"
    });
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Value copied to clipboard"
      });
    } catch {
      toast({
        title: "Copy failed",
        description: "Please select and copy manually",
        variant: "destructive"
      });
    }
  };

  const testPayload = useMemo(() => {
    return {
      data: [{
        event_name: "PageView",
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        event_source_url: eventSourceUrl,
        user_data: {
          fbc: testFbc || undefined,
          fbp: testFbp || undefined,
          client_ip_address: "0.0.0.0",
          client_user_agent: navigator.userAgent
        }
      }],
      test_event_code: testEventCode
    };
  }, [testFbc, testFbp, testEventCode, eventSourceUrl]);

  const handleSendTestEvent = async () => {
    if (!pixelId.trim() || !accessToken.trim()) {
      toast({
        title: "Missing credentials",
        description: "Please enter both Pixel ID and Access Token",
        variant: "destructive"
      });
      return;
    }

    setIsSending(true);
    setApiResponse(null);

    try {
      const response = await fetch("/api/test-capi-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pixelId: pixelId.trim(),
          accessToken: accessToken.trim(),
          fbc: testFbc.trim() || undefined,
          fbp: testFbp.trim() || undefined,
          testEventCode: testEventCode.trim(),
          eventSourceUrl: eventSourceUrl.trim()
        })
      });

      const data = await response.json();
      setApiResponse(data);

      if (data.success) {
        toast({
          title: "Test Event Sent!",
          description: `Events received: ${data.response?.events_received || 0}`
        });
      } else {
        toast({
          title: "Event Failed",
          description: data.error || "Check the response details",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      setApiResponse({ success: false, error: error.message });
      toast({
        title: "Request Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold" data-testid="text-page-title">
            Meta Conversions API Validator
          </h1>
          <p className="text-muted-foreground">
            Validate fbc/fbp parameters and send test events to Meta CAPI
          </p>
        </div>

        <Tabs defaultValue="validate" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="validate" data-testid="tab-validate">Validate</TabsTrigger>
            <TabsTrigger value="generate" data-testid="tab-generate">Generate</TabsTrigger>
            <TabsTrigger value="test" data-testid="tab-test">Test Event</TabsTrigger>
          </TabsList>

          <TabsContent value="validate" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  fbc Validator
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      The fbc parameter contains the Facebook click ID from ad URLs. 
                      Format: fb.1.[timestamp].[fbclid]
                    </TooltipContent>
                  </Tooltip>
                </CardTitle>
                <CardDescription>
                  Validate that your fbc parameter follows Meta's required format
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fbc-input">fbc Value</Label>
                  <div className="flex gap-2">
                    <Input
                      id="fbc-input"
                      data-testid="input-fbc"
                      placeholder="fb.1.1554763741205.AbCdEfGhIjKlMnOpQrStUvWxYz"
                      value={fbc}
                      onChange={(e) => setFbc(e.target.value)}
                      className={fbc ? (fbcValidation.isValid ? "border-green-500" : "border-red-500") : ""}
                    />
                    {fbc && (
                      <Badge 
                        variant={fbcValidation.isValid ? "default" : "destructive"}
                        className="shrink-0"
                      >
                        {fbcValidation.isValid ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                      </Badge>
                    )}
                  </div>
                </div>

                {fbc && (
                  <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium text-sm">Validation Checklist</h4>
                    <div className="space-y-2">
                      {fbcValidation.checks.map((check) => (
                        <div key={check.id} className="flex items-start gap-2 text-sm">
                          {check.passed ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className={check.passed ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}>
                                {check.label}
                              </span>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Info className="h-3 w-3 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                  {check.tooltip}
                                </TooltipContent>
                              </Tooltip>
                            </div>
                            <p className="text-xs text-muted-foreground">{check.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  fbp Validator
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      The fbp parameter is the browser pixel cookie. 
                      Format: fb.1.[timestamp].[random]
                    </TooltipContent>
                  </Tooltip>
                </CardTitle>
                <CardDescription>
                  Validate your fbp (browser pixel) parameter format
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fbp-input">fbp Value</Label>
                  <div className="flex gap-2">
                    <Input
                      id="fbp-input"
                      data-testid="input-fbp"
                      placeholder="fb.1.1558571054389.1098115397"
                      value={fbp}
                      onChange={(e) => setFbp(e.target.value)}
                      className={fbp ? (fbpValidation.isValid ? "border-green-500" : "border-red-500") : ""}
                    />
                    {fbp && (
                      <Badge 
                        variant={fbpValidation.isValid ? "default" : "destructive"}
                        className="shrink-0"
                      >
                        {fbpValidation.isValid ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                      </Badge>
                    )}
                  </div>
                </div>

                {fbp && (
                  <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium text-sm">Validation Checklist</h4>
                    <div className="space-y-2">
                      {fbpValidation.checks.map((check) => (
                        <div key={check.id} className="flex items-start gap-2 text-sm">
                          {check.passed ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className={check.passed ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}>
                                {check.label}
                              </span>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Info className="h-3 w-3 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                  {check.tooltip}
                                </TooltipContent>
                              </Tooltip>
                            </div>
                            <p className="text-xs text-muted-foreground">{check.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="generate" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Generate fbc from fbclid</CardTitle>
                <CardDescription>
                  Create a properly formatted fbc value from a raw fbclid URL parameter
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fbclid-input">Raw fbclid from URL</Label>
                  <Input
                    id="fbclid-input"
                    data-testid="input-fbclid"
                    placeholder="IwAR3xY1z2a3b4c5d6e7f8g9h0i1j2k3l4m5n6o7p8q9r0s"
                    value={fbclid}
                    onChange={(e) => setFbclid(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Paste the fbclid value from your Facebook ad URL (the part after ?fbclid= or &fbclid=)
                  </p>
                </div>

                <Button 
                  onClick={handleGenerateFbc} 
                  className="w-full"
                  data-testid="button-generate-fbc"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Generate fbc
                </Button>

                {generatedFbc && (
                  <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
                    <Label>Generated fbc</Label>
                    <div className="flex gap-2">
                      <Input 
                        value={generatedFbc} 
                        readOnly 
                        className="font-mono text-sm"
                        data-testid="input-generated-fbc"
                      />
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => copyToClipboard(generatedFbc)}
                        data-testid="button-copy-fbc"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>Format: fb.1.[current-timestamp].[fbclid]</p>
                      <p>Timestamp: {new Date(parseInt(generatedFbc.split(".")[2])).toISOString()}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="test" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Test Event Sender
                </CardTitle>
                <CardDescription>
                  Send a test PageView event to Meta's Conversions API to verify your setup
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="pixel-id">Pixel ID</Label>
                    <Input
                      id="pixel-id"
                      data-testid="input-pixel-id"
                      placeholder="820265613947331"
                      value={pixelId}
                      onChange={(e) => setPixelId(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="access-token">Access Token</Label>
                    <Input
                      id="access-token"
                      data-testid="input-access-token"
                      type="password"
                      placeholder="EAAxxxxxxx..."
                      value={accessToken}
                      onChange={(e) => setAccessToken(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="test-fbc">fbc (optional)</Label>
                    <Input
                      id="test-fbc"
                      data-testid="input-test-fbc"
                      placeholder="fb.1.1554763741205.AbCdEf..."
                      value={testFbc}
                      onChange={(e) => setTestFbc(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="test-fbp">fbp (optional)</Label>
                    <Input
                      id="test-fbp"
                      data-testid="input-test-fbp"
                      placeholder="fb.1.1558571054389.1098115397"
                      value={testFbp}
                      onChange={(e) => setTestFbp(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="test-event-code">Test Event Code</Label>
                    <Input
                      id="test-event-code"
                      data-testid="input-test-event-code"
                      placeholder="TEST12345"
                      value={testEventCode}
                      onChange={(e) => setTestEventCode(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="event-source-url">Event Source URL</Label>
                    <Input
                      id="event-source-url"
                      data-testid="input-event-source-url"
                      placeholder="https://example.com"
                      value={eventSourceUrl}
                      onChange={(e) => setEventSourceUrl(e.target.value)}
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleSendTestEvent} 
                  className="w-full"
                  disabled={isSending}
                  data-testid="button-send-test-event"
                >
                  {isSending ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Test Event
                    </>
                  )}
                </Button>

                <div className="space-y-2">
                  <Label>Payload Preview</Label>
                  <div className="relative">
                    <pre className="p-4 bg-muted rounded-lg text-xs overflow-x-auto font-mono">
                      {JSON.stringify(testPayload, null, 2)}
                    </pre>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(JSON.stringify(testPayload, null, 2))}
                      data-testid="button-copy-payload"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {apiResponse && (
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      API Response
                      {apiResponse.success ? (
                        <Badge variant="default" className="bg-green-600">
                          <Check className="h-3 w-3 mr-1" /> Success
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <X className="h-3 w-3 mr-1" /> Failed
                        </Badge>
                      )}
                    </Label>
                    <pre className={`p-4 rounded-lg text-xs overflow-x-auto font-mono ${
                      apiResponse.success ? "bg-green-50 dark:bg-green-950/30" : "bg-red-50 dark:bg-red-950/30"
                    }`}>
                      {JSON.stringify(apiResponse, null, 2)}
                    </pre>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  Important Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-500">1.</span>
                    Test events only appear in Events Manager's "Test Events" tab, not in regular event data.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-500">2.</span>
                    The test_event_code expires after 24 hours. Generate a new one in Events Manager.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-500">3.</span>
                    fbc values must NOT be hashed. Send them in their original format.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-500">4.</span>
                    For production events, remove the test_event_code parameter.
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
