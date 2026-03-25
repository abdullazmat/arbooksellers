"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  CreditCard,
  Truck,
  Mail,
  Settings as SettingsIcon,
  Save,
  TestTube,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { toast } from "@/components/ui/use-toast";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState({
    // General Settings
    storeName: "Islamic Books Store",
    storeDescription: "Your trusted source for authentic Islamic literature",
    storeEmail: "contact@arbooksellers.com",
    storePhone: "+92-300-8016812",
    storeAddress: "17-Aziz Market, Urdu Bazar, Lahore",

    // Payment Settings
    stripeEnabled: true,
    stripePublishableKey: "pk_test_...",
    stripeSecretKey: "sk_test_...",
    paypalEnabled: true,
    paypalClientId: "client_id_...",
    paypalSecret: "secret_...",

    // Shipping Settings
    freeShippingThreshold: 75,
    standardShippingCost: 9.99,
    expressShippingCost: 19.99,
    shippingZones: [
      { name: "US Domestic", cost: 9.99 },
      { name: "Canada", cost: 15.99 },
      { name: "International", cost: 29.99 },
    ],

    // SEO Settings
    metaTitle: "Islamic Books Store - Authentic Islamic Literature",
    metaDescription:
      "Discover authentic Islamic books, Quran translations, Hadith collections, and Islamic literature for all ages.",
    metaKeywords:
      "islamic books, quran, hadith, islamic literature, muslim books",
    googleAnalyticsId: "GA-XXXXXXXXX",

    // Email Settings
    smtpHost: "smtp.gmail.com",
    smtpPort: 587,
    smtpUsername: "noreply@islamicbooks.com",
    smtpPassword: "********",
    emailFromName: "Islamic Books Store",
    emailFromAddress: "noreply@islamicbooks.com",

    // Security Settings
    twoFactorEnabled: false,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isTestingEmail, setIsTestingEmail] = useState(false);

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSaveSettings = async () => {
    try {
      setIsSaving(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Settings saved",
        description: "Your settings have been updated successfully.",
      });
      
      setIsSaving(false);
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
      setIsSaving(false);
    }
  };

  const handleTestEmail = async () => {
    try {
      setIsTestingEmail(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Email test successful",
        description: "Test email sent successfully. Check your inbox.",
      });
      
      setIsTestingEmail(false);
    } catch (error) {
      console.error("Error testing email:", error);
      toast({
        title: "Email test failed",
        description: "Failed to send test email. Please check your configuration.",
        variant: "destructive",
      });
      setIsTestingEmail(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600">
              Configure your store settings and preferences
            </p>
          </div>
          <Button onClick={handleSaveSettings} disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        {/* Settings Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
            <TabsTrigger value="shipping">Shipping</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <SettingsIcon className="h-5 w-5" />
                  <span>General Store Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="storeName">Store Name</Label>
                    <Input
                      id="storeName"
                      value={settings.storeName}
                      onChange={(e) =>
                        handleSettingChange("storeName", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="storeEmail">Store Email</Label>
                    <Input
                      id="storeEmail"
                      type="email"
                      value={settings.storeEmail}
                      onChange={(e) =>
                        handleSettingChange("storeEmail", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeDescription">Store Description</Label>
                  <Textarea
                    id="storeDescription"
                    value={settings.storeDescription}
                    onChange={(e) =>
                      handleSettingChange("storeDescription", e.target.value)
                    }
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="storePhone">Store Phone</Label>
                    <Input
                      id="storePhone"
                      value={settings.storePhone}
                      onChange={(e) =>
                        handleSettingChange("storePhone", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="storeAddress">Store Address</Label>
                    <Input
                      id="storeAddress"
                      value={settings.storeAddress}
                      onChange={(e) =>
                        handleSettingChange("storeAddress", e.target.value)
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Settings */}
          <TabsContent value="payment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Payment Gateway Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Stripe Settings */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Stripe</h3>
                    <Switch
                      checked={settings.stripeEnabled}
                      onCheckedChange={(checked) =>
                        handleSettingChange("stripeEnabled", checked)
                      }
                    />
                  </div>
                  {settings.stripeEnabled && (
                    <div className="space-y-4 pl-4">
                      <div className="space-y-2">
                        <Label htmlFor="stripePublishableKey">
                          Publishable Key
                        </Label>
                        <Input
                          id="stripePublishableKey"
                          value={settings.stripePublishableKey}
                          onChange={(e) =>
                            handleSettingChange(
                              "stripePublishableKey",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="stripeSecretKey">Secret Key</Label>
                        <Input
                          id="stripeSecretKey"
                          type="password"
                          value={settings.stripeSecretKey}
                          onChange={(e) =>
                            handleSettingChange(
                              "stripeSecretKey",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                {/* PayPal Settings */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">PayPal</h3>
                    <Switch
                      checked={settings.paypalEnabled}
                      onCheckedChange={(checked) =>
                        handleSettingChange("paypalEnabled", checked)
                      }
                    />
                  </div>
                  {settings.paypalEnabled && (
                    <div className="space-y-4 pl-4">
                      <div className="space-y-2">
                        <Label htmlFor="paypalClientId">Client ID</Label>
                        <Input
                          id="paypalClientId"
                          value={settings.paypalClientId}
                          onChange={(e) =>
                            handleSettingChange(
                              "paypalClientId",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="paypalSecret">Secret</Label>
                        <Input
                          id="paypalSecret"
                          type="password"
                          value={settings.paypalSecret}
                          onChange={(e) =>
                            handleSettingChange("paypalSecret", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Shipping Settings */}
          <TabsContent value="shipping" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Truck className="h-5 w-5" />
                  <span>Shipping Configuration</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="freeShippingThreshold">
                      Free Shipping Threshold ($)
                    </Label>
                    <Input
                      id="freeShippingThreshold"
                      type="number"
                      value={settings.freeShippingThreshold}
                      onChange={(e) =>
                        handleSettingChange(
                          "freeShippingThreshold",
                          parseFloat(e.target.value)
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="standardShippingCost">
                      Standard Shipping Cost ($)
                    </Label>
                    <Input
                      id="standardShippingCost"
                      type="number"
                      step="0.01"
                      value={settings.standardShippingCost}
                      onChange={(e) =>
                        handleSettingChange(
                          "standardShippingCost",
                          parseFloat(e.target.value)
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expressShippingCost">
                      Express Shipping Cost ($)
                    </Label>
                    <Input
                      id="expressShippingCost"
                      type="number"
                      step="0.01"
                      value={settings.expressShippingCost}
                      onChange={(e) =>
                        handleSettingChange(
                          "expressShippingCost",
                          parseFloat(e.target.value)
                        )
                      }
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Shipping Zones</h3>
                  <div className="space-y-4">
                    {settings.shippingZones.map((zone, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <Input
                          value={zone.name}
                          onChange={(e) => {
                            const newZones = [...settings.shippingZones];
                            newZones[index].name = e.target.value;
                            handleSettingChange("shippingZones", newZones);
                          }}
                          placeholder="Zone name"
                          className="flex-1"
                        />
                        <Input
                          type="number"
                          step="0.01"
                          value={zone.cost}
                          onChange={(e) => {
                            const newZones = [...settings.shippingZones];
                            newZones[index].cost = parseFloat(e.target.value);
                            handleSettingChange("shippingZones", newZones);
                          }}
                          placeholder="Cost"
                          className="w-24"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newZones = settings.shippingZones.filter(
                              (_, i) => i !== index
                            );
                            handleSettingChange("shippingZones", newZones);
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      onClick={() => {
                        const newZones = [
                          ...settings.shippingZones,
                          { name: "", cost: 0 },
                        ];
                        handleSettingChange("shippingZones", newZones);
                      }}
                    >
                      Add Zone
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SEO tab removed */}

          {/* Email Settings */}
          <TabsContent value="email" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mail className="h-5 w-5" />
                  <span>Email Configuration</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="smtpHost">SMTP Host</Label>
                    <Input
                      id="smtpHost"
                      value={settings.smtpHost}
                      onChange={(e) =>
                        handleSettingChange("smtpHost", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpPort">SMTP Port</Label>
                    <Input
                      id="smtpPort"
                      type="number"
                      value={settings.smtpPort}
                      onChange={(e) =>
                        handleSettingChange(
                          "smtpPort",
                          parseInt(e.target.value)
                        )
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="smtpUsername">SMTP Username</Label>
                    <Input
                      id="smtpUsername"
                      value={settings.smtpUsername}
                      onChange={(e) =>
                        handleSettingChange("smtpUsername", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpPassword">SMTP Password</Label>
                    <Input
                      id="smtpPassword"
                      type="password"
                      value={settings.smtpPassword}
                      onChange={(e) =>
                        handleSettingChange("smtpPassword", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="emailFromName">From Name</Label>
                    <Input
                      id="emailFromName"
                      value={settings.emailFromName}
                      onChange={(e) =>
                        handleSettingChange("emailFromName", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emailFromAddress">From Address</Label>
                    <Input
                      id="emailFromAddress"
                      type="email"
                      value={settings.emailFromAddress}
                      onChange={(e) =>
                        handleSettingChange("emailFromAddress", e.target.value)
                      }
                    />
                  </div>
                </div>
                <Button onClick={handleTestEmail} disabled={isTestingEmail}>
                  <TestTube className="mr-2 h-4 w-4" />
                  {isTestingEmail ? "Testing..." : "Test Email Configuration"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security tab removed */}
        </Tabs>
      </div>
    </AdminLayout>
  );
}
