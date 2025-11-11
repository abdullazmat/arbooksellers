'use client'

import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useToast } from '@/components/ui/use-toast'
import { Mail, Phone, MapPin, Send } from 'lucide-react'
import { useState } from 'react'

export default function ContactPage() {
  const { toast } = useToast()
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!form.name.trim()) newErrors.name = 'Name is required'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email)) newErrors.email = 'Valid email is required'
    if (!form.subject.trim()) newErrors.subject = 'Subject is required'
    if (!form.message.trim() || form.message.trim().length < 5) {
      newErrors.message = 'Message must be at least 5 characters'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    try {
      setSubmitting(true)
      setSuccess(null)
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.error || 'Failed to submit')
      }
      toast({ title: 'Message sent', description: 'We will get back to you shortly.' })
      setSuccess('Your message has been sent successfully. We will get back to you shortly.')
      setForm({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch (err: any) {
      toast({ title: 'Submit failed', description: err?.message || 'Please try again', variant: 'destructive' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Contact Us</CardTitle>
                </CardHeader>
                <CardContent>
                  {success && (
                    <Alert className="mb-4">
                      <AlertTitle>Success</AlertTitle>
                      <AlertDescription>{success}</AlertDescription>
                    </Alert>
                  )}
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" name="name" value={form.name} onChange={handleChange} />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone (optional)</Label>
                        <Input id="phone" name="phone" value={form.phone} onChange={handleChange} placeholder="+92-300-8016812" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input id="subject" name="subject" value={form.subject} onChange={handleChange} />
                        {errors.subject && <p className="text-red-500 text-sm">{errors.subject}</p>}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea id="message" name="message" rows={5} value={form.message} onChange={handleChange} />
                      {errors.message && <p className="text-red-500 text-sm">{errors.message}</p>}
                    </div>
                    <Button type="submit" disabled={submitting} className="inline-flex items-center">
                      <Send className="h-4 w-4 mr-2" />
                      {submitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-4">
              <Card className="border-0 shadow-md">
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-green-600" />
                    <span>17-Aziz Market, Urdu Bazar, Lahore</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-green-600" />
                    <span>+92-300-8016812</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-green-600" />
                    <a href="mailto:Alrahim95@gmail.com" className="hover:underline">
                      Alrahim95@gmail.com
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}


