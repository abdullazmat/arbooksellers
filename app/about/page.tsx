import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Users, Award, Globe, Heart, Shield } from 'lucide-react'

const teamMembers = [
  {
    name: 'Dr. Ahmad Rahman',
    role: 'Founder & Islamic Scholar',
    image: '/placeholder.svg?height=200&width=200',
    description: 'PhD in Islamic Studies from Al-Azhar University. 20+ years experience in Islamic education and book curation.'
  },
  {
    name: 'Fatima Al-Zahra',
    role: 'Head of Content',
    image: '/placeholder.svg?height=200&width=200',
    description: 'Masters in Arabic Literature. Specializes in authenticating Islamic texts and translations.'
  },
  {
    name: 'Omar Hassan',
    role: 'Customer Relations',
    image: '/placeholder.svg?height=200&width=200',
    description: 'Dedicated to providing exceptional customer service and helping customers find the right Islamic books.'
  },
  {
    name: 'Aisha Khan',
    role: 'Quality Assurance',
    image: '/placeholder.svg?height=200&width=200',
    description: 'Ensures all books meet our high standards for authenticity and quality before reaching customers.'
  }
]

const values = [
  {
    icon: BookOpen,
    title: 'Authentic Knowledge',
    description: 'We carefully curate books from trusted scholars and verified publishers to ensure authenticity and accuracy.'
  },
  {
    icon: Heart,
    title: 'Serving the Ummah',
    description: 'Our mission is to make authentic Islamic knowledge accessible to Muslims worldwide, fostering spiritual growth.'
  },
  {
    icon: Shield,
    title: 'Trust & Integrity',
    description: 'We maintain the highest standards of integrity in our business practices and book selection process.'
  },
  {
    icon: Globe,
    title: 'Global Reach',
    description: 'Serving Muslim communities across the globe with fast, reliable shipping and multilingual support.'
  }
]

const stats = [
  { number: '50,000+', label: 'Happy Customers' },
  { number: '1,000+', label: 'Islamic Books' },
  { number: '25+', label: 'Languages' },
  { number: '15+', label: 'Years Experience' }
]

export default function AboutPage() {
  return (
    <main className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-green-50 via-white to-yellow-50 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-4 bg-green-100 text-green-800">About Us</Badge>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Spreading Islamic Knowledge
                <span className="text-green-600 block">Across the World</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                For over 15 years, we have been dedicated to providing authentic Islamic literature 
                to Muslims worldwide. Our mission is to make the treasures of Islamic knowledge 
                accessible to everyone, fostering spiritual growth and understanding.
              </p>
              <div className="text-center">
                <p className="text-2xl font-arabic text-green-600 mb-2">
                  وَقُل رَّبِّ زِدْنِي عِلْمًا
                </p>
                <p className="text-gray-600 italic">
                  "And say: My Lord, increase me in knowledge" - Quran 20:114
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl lg:text-4xl font-bold text-green-600 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                    <BookOpen className="h-6 w-6 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
                  <p className="text-gray-700 leading-relaxed">
                    To provide authentic, high-quality Islamic books and literature to Muslims 
                    around the world, making the treasures of Islamic knowledge accessible to 
                    everyone regardless of their location or background. We strive to be the 
                    most trusted source for Islamic education materials.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                    <Award className="h-6 w-6 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
                  <p className="text-gray-700 leading-relaxed">
                    To become the leading global platform for Islamic literature, fostering 
                    a world where authentic Islamic knowledge is easily accessible to every 
                    Muslim. We envision communities strengthened by proper understanding of 
                    Islam through quality books and educational materials.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Our Islamic Values
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Everything we do is guided by Islamic principles and our commitment 
                to serving the Muslim community with integrity and excellence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => {
                const IconComponent = value.icon
                return (
                  <Card key={index} className="text-center border-0 shadow-md hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <IconComponent className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        {value.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Meet Our Team
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Our dedicated team of Islamic scholars and professionals work tirelessly 
                to bring you the best Islamic literature from around the world.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <img
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                    />
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {member.name}
                    </h3>
                    <p className="text-green-600 font-medium mb-3">{member.role}</p>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {member.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  Our Story
                </h2>
              </div>

              <div className="prose prose-lg max-w-none text-gray-700">
                <p className="text-xl leading-relaxed mb-6">
                  Islamic Books Store was founded in 2009 with a simple yet profound mission: 
                  to make authentic Islamic knowledge accessible to Muslims worldwide. What started 
                  as a small bookstore in our local community has grown into a trusted global 
                  platform serving over 50,000 customers across 40+ countries.
                </p>

                <p className="leading-relaxed mb-6">
                  Our founder, Dr. Ahmad Rahman, recognized the need for a reliable source of 
                  authentic Islamic literature after struggling to find quality books for his 
                  own Islamic studies. With his background in Islamic scholarship and a passion 
                  for education, he began curating a collection of books from the most respected 
                  scholars and publishers in the Islamic world.
                </p>

                <p className="leading-relaxed mb-6">
                  Today, we work directly with renowned publishers like Darussalam, Islamic 
                  Foundation, and many others to ensure that every book in our collection meets 
                  the highest standards of authenticity and quality. Our team of Islamic scholars 
                  carefully reviews each title to verify its adherence to authentic Islamic teachings.
                </p>

                <p className="leading-relaxed">
                  We believe that knowledge is the foundation of faith, and we are honored to 
                  play a role in spreading Islamic knowledge to communities around the world. 
                  Whether you're a student of Islamic studies, a parent looking for children's 
                  Islamic books, or someone seeking to deepen your understanding of Islam, 
                  we are here to serve you with dedication and integrity.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 bg-green-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Have Questions?</h2>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              We're here to help you find the perfect Islamic books for your spiritual journey. 
              Don't hesitate to reach out to our knowledgeable team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:info@islamicbooks.com"
                className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
              >
                Email Us
              </a>
              <a
                href="tel:+15551234567"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
              >
                Call Us
              </a>
            </div>
          </div>
        </section>
      </main>
  )
}
