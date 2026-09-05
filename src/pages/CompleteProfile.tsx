import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft, ArrowRight, Check, Sparkles } from 'lucide-react';

const CompleteProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // Basic startup information
  const [basicData, setBasicData] = useState({
    startup_name: '',
    industry: '',
    stage: '',
    description: '',
    team_size: '',
    founded_year: '',
    website: '',
  });

  // Extended startup information
  const [extendedData, setExtendedData] = useState({
    headquarters: '',
    legal_entity_name: '',
    incorporation_country: '',
    contact_email: '',
    contact_phone: '',
    revenue_current_year: '',
    monthly_burn: '',
    runway_months: '',
    funding_ask: '',
    funding_use: '',
  });

  // Domain-specific data
  const [domainData, setDomainData] = useState({
    // Healthcare
    regulatory_approvals: '',
    clinical_stage: '',
    target_patient_population: '',
    reimbursement_strategy: '',
    clinical_partners: '',
    estimated_time_to_market_months: '',
    
    // Fintech
    licencing_requirements: '',
    payments_volume_30d: '',
    kyc_process: '',
    principal_markets: '',
    integrations: '',
    
    // Food
    suppliers: '',
    supply_chain_risks: '',
    perishability_days: '',
    food_safety_certifications: '',
    gross_margin_percent: '',
    
    // E-commerce
    primary_channels: '',
    average_order_value: '',
    monthly_active_buyers: '',
    fulfillment_strategy: '',
    return_rate_percent: '',
  });

  // Founder assets data
  const [founderAssetsData, setFounderAssetsData] = useState({
    // Personal Financial Information
    personal_net_worth: '',
    liquid_assets: '',
    personal_annual_income: '',
    credit_score: '',
    
    // Investment Portfolio
    stock_investments: '',
    crypto_investments: '',
    real_estate_investments: '',
    other_investments: '',
    
    // Real Estate Assets
    primary_residence_value: '',
    investment_properties_value: '',
    total_real_estate_debt: '',
    
    // Business Assets & Equity
    previous_startup_exits: '',
    current_business_equity_value: '',
    intellectual_property_value: '',
    business_assets_description: '',
    
    // Financial Commitments
    personal_debt: '',
    monthly_personal_expenses: '',
    dependents_count: '',
    
    // Funding & Investment Details
    personal_funds_committed_to_startup: '',
    previous_funding_raised: '',
    investor_connections: '',
    board_memberships: '',
    
    // Professional Assets
    industry_experience_years: '',
    previous_companies: '',
    professional_network_value: '',
    advisory_roles: '',
    
    // Additional Information
    insurance_coverage_amount: '',
    retirement_savings: '',
    emergency_fund_months: '',
    risk_tolerance: '',
  });

  const [autoFillIndex, setAutoFillIndex] = useState(0);

  const autoFillPresets = [
    {
      name: 'NovaPay AI (FinTech)',
      basicData: {
        startup_name: 'NovaPay AI',
        industry: 'fintech',
        stage: 'seed',
        description: 'AI-driven payment fraud detection and automated checkout authorization for mid-market merchants.',
        team_size: '12',
        founded_year: '2024',
        website: 'https://novapay.ai',
      },
      extendedData: {
        headquarters: 'San Francisco, CA',
        legal_entity_name: 'NovaPay Technologies Inc.',
        incorporation_country: 'United States',
        contact_email: 'founder@novapay.ai',
        contact_phone: '+15550192834',
        revenue_current_year: '350000',
        monthly_burn: '25000',
        runway_months: '18',
        funding_ask: '2000000',
        funding_use: '45% Engineering & AI Team Expansion, 35% GTM Sales, 20% Security & Compliance',
      },
      domainData: {
        regulatory_approvals: 'HIPAA compliant, FDA Class II pre-submission filed',
        clinical_stage: 'Phase II Pilot',
        target_patient_population: 'Chronic disease & diabetes management',
        reimbursement_strategy: 'B2B enterprise SaaS & insurance provider reimbursement',
        clinical_partners: 'Mayo Clinic, Stanford Health Care',
        estimated_time_to_market_months: '18',
        licencing_requirements: 'FinCEN MSB registered, Money Transmitter License pending in 12 states',
        payments_volume_30d: '1250000',
        kyc_process: 'Automated instant identity verification with synthetic fraud detection',
        principal_markets: 'North America, EU, APAC',
        integrations: 'Stripe, Plaid, Razorpay, Banking APIs',
        suppliers: 'Organic Valley Farms, Global Spices Co.',
        supply_chain_risks: 'Perishable cold chain temperature fluctuations',
        perishability_days: '45',
        food_safety_certifications: 'USDA Organic, HACCP Certified, SQF Level 2',
        gross_margin_percent: '52',
        primary_channels: 'Shopify Storefront, Amazon Marketplace, Direct Web',
        average_order_value: '85',
        monthly_active_buyers: '14200',
        fulfillment_strategy: '3PL Warehousing with 2-day delivery across US',
        return_rate_percent: '4.2',
      },
      founderAssetsData: {
        personal_net_worth: '750000',
        liquid_assets: '150000',
        personal_annual_income: '160000',
        credit_score: '780',
        stock_investments: '80000',
        crypto_investments: '30000',
        real_estate_investments: '350000',
        other_investments: '40000',
        primary_residence_value: '650000',
        investment_properties_value: '350000',
        total_real_estate_debt: '400000',
        previous_startup_exits: '500000',
        current_business_equity_value: '1200000',
        intellectual_property_value: '200000',
        business_assets_description: 'Proprietary graph AI fraud prevention algorithm & pending patents',
        personal_debt: '20000',
        monthly_personal_expenses: '7500',
        dependents_count: '2',
        personal_funds_committed_to_startup: '120000',
        previous_funding_raised: '400000',
        investor_connections: 'Y Combinator alumni, Techstars mentors, Sequoia scout network',
        board_memberships: 'NovaPay Technologies, FinTech Innovators Foundation',
        industry_experience_years: '12',
        previous_companies: 'Ex-Senior Engineer at PayPal, Tech Lead at Razorpay',
        professional_network_value: 'Strong network of fintech CTOs and VP Risk executives',
        advisory_roles: 'Advisor at EarlyStage Ventures',
        insurance_coverage_amount: '2000000',
        retirement_savings: '180000',
        emergency_fund_months: '8',
        risk_tolerance: 'high',
      }
    },
    {
      name: 'BioPulse Therapeutics (Healthcare)',
      basicData: {
        startup_name: 'BioPulse Therapeutics',
        industry: 'healthcare',
        stage: 'series-a',
        description: 'AI-powered remote patient monitoring and early cardiac arrhythmia diagnostic platform.',
        team_size: '18',
        founded_year: '2023',
        website: 'https://biopulse.med',
      },
      extendedData: {
        headquarters: 'Boston, MA',
        legal_entity_name: 'BioPulse Health Systems LLC',
        incorporation_country: 'United States',
        contact_email: 'contact@biopulse.med',
        contact_phone: '+16175550188',
        revenue_current_year: '620000',
        monthly_burn: '45000',
        runway_months: '22',
        funding_ask: '5000000',
        funding_use: '50% Clinical Trials & FDA Clearance, 30% Enterprise Hospital Sales, 20% R&D',
      },
      domainData: {
        regulatory_approvals: 'FDA 510(k) cleared for Class II diagnostic device, HIPAA & ISO 27001 certified',
        clinical_stage: 'Phase II Clinical Trial at Brigham and Women Hospital',
        target_patient_population: 'Elderly cardiovascular patients and outpatient post-op recovery',
        reimbursement_strategy: 'CPT code reimbursement via Medicare/Medicaid and private commercial insurers',
        clinical_partners: 'Mayo Clinic, Harvard Medical School, Johns Hopkins Medicine',
        estimated_time_to_market_months: '12',
        licencing_requirements: 'State medical device distributor licenses',
        payments_volume_30d: '0',
        kyc_process: 'Patient identity verification & HIPAA compliance portal',
        principal_markets: 'US, EU',
        integrations: 'Epic Systems, Cerner EHR, Apple HealthKit',
        suppliers: 'Medical Sensor Components Inc.',
        supply_chain_risks: 'Sterile component delivery delays',
        perishability_days: '365',
        food_safety_certifications: 'N/A',
        gross_margin_percent: '68',
        primary_channels: 'Direct Hospital Enterprise Sales',
        average_order_value: '25000',
        monthly_active_buyers: '120',
        fulfillment_strategy: 'Direct Medical Courier',
        return_rate_percent: '1.0',
      },
      founderAssetsData: {
        personal_net_worth: '1200000',
        liquid_assets: '300000',
        personal_annual_income: '220000',
        credit_score: '810',
        stock_investments: '150000',
        crypto_investments: '10000',
        real_estate_investments: '500000',
        other_investments: '50000',
        primary_residence_value: '850000',
        investment_properties_value: '450000',
        total_real_estate_debt: '350000',
        previous_startup_exits: '1500000',
        current_business_equity_value: '2500000',
        intellectual_property_value: '600000',
        business_assets_description: '3 granted medical patents & ECG algorithm copyright',
        personal_debt: '15000',
        monthly_personal_expenses: '9000',
        dependents_count: '1',
        personal_funds_committed_to_startup: '250000',
        previous_funding_raised: '1200000',
        investor_connections: 'Khosla Ventures, NEA Medtech network, Rock Health angels',
        board_memberships: 'BioPulse Board, American Heart Association Digital Advisory',
        industry_experience_years: '15',
        previous_companies: 'Ex-Director of Biomedical Engineering at Medtronic',
        professional_network_value: 'Direct connections with Chief Medical Officers across top 50 US hospital systems',
        advisory_roles: 'Advisory Board Member at Digital Health Accelerator',
        insurance_coverage_amount: '3000000',
        retirement_savings: '320000',
        emergency_fund_months: '12',
        risk_tolerance: 'medium',
      }
    },
    {
      name: 'NutriCraft Organics (Food & Beverage)',
      basicData: {
        startup_name: 'NutriCraft Organics',
        industry: 'food',
        stage: 'pre-seed',
        description: 'Plant-based functional protein beverages with zero artificial preservatives and smart shelf-life technology.',
        team_size: '8',
        founded_year: '2024',
        website: 'https://nutricraft.io',
      },
      extendedData: {
        headquarters: 'Austin, TX',
        legal_entity_name: 'NutriCraft Foods Inc.',
        incorporation_country: 'United States',
        contact_email: 'hello@nutricraft.io',
        contact_phone: '+15125550199',
        revenue_current_year: '180000',
        monthly_burn: '15000',
        runway_months: '14',
        funding_ask: '1000000',
        funding_use: '40% Retail Distribution Expansion, 35% Copacker Scaling, 25% Marketing',
      },
      domainData: {
        regulatory_approvals: 'FDA registered facility',
        clinical_stage: 'N/A',
        target_patient_population: 'N/A',
        reimbursement_strategy: 'N/A',
        clinical_partners: 'N/A',
        estimated_time_to_market_months: '0',
        licencing_requirements: 'State Health Department Food Processor License',
        payments_volume_30d: '15000',
        kyc_process: 'N/A',
        principal_markets: 'US Southwest & West Coast',
        integrations: 'Shopify, UNFI, KeHE Distribution',
        suppliers: 'Organic Valley Co-Op, Pacific Coast Ingredients, EcoPack Solutions',
        supply_chain_risks: 'Seasonal ingredient price variance & cold-chain distribution logistics',
        perishability_days: '90',
        food_safety_certifications: 'USDA Organic, Non-GMO Project Verified, HACCP Certified, SQF Level 3',
        gross_margin_percent: '58',
        primary_channels: 'Whole Foods Market, Sprouts, Direct E-commerce',
        average_order_value: '42',
        monthly_active_buyers: '4500',
        fulfillment_strategy: 'Cold-chain 3PL Distribution',
        return_rate_percent: '1.2',
      },
      founderAssetsData: {
        personal_net_worth: '480000',
        liquid_assets: '80000',
        personal_annual_income: '110000',
        credit_score: '740',
        stock_investments: '35000',
        crypto_investments: '15000',
        real_estate_investments: '180000',
        other_investments: '20000',
        primary_residence_value: '450000',
        investment_properties_value: '0',
        total_real_estate_debt: '280000',
        previous_startup_exits: '0',
        current_business_equity_value: '600000',
        intellectual_property_value: '80000',
        business_assets_description: 'Proprietary cold-brew extraction process & trade secret formulation',
        personal_debt: '12000',
        monthly_personal_expenses: '5500',
        dependents_count: '0',
        personal_funds_committed_to_startup: '80000',
        previous_funding_raised: '150000',
        investor_connections: 'FoodBytes by Rabobank, CPG Angel Network, SKU Accelerator',
        board_memberships: 'NutriCraft Board',
        industry_experience_years: '8',
        previous_companies: 'Former Brand Manager at Whole Foods & RXBAR',
        professional_network_value: 'WFM brokers, Target buyers, and regional distributors in Southwest',
        advisory_roles: 'Mentor at Local Food Incubator',
        insurance_coverage_amount: '1000000',
        retirement_savings: '90000',
        emergency_fund_months: '6',
        risk_tolerance: 'high',
      }
    },
    {
      name: 'StyleSphere Commerce (E-Commerce)',
      basicData: {
        startup_name: 'StyleSphere Commerce',
        industry: 'ecommerce',
        stage: 'seed',
        description: 'AI virtual try-on and personalized fashion recommendation marketplace connecting sustainable brands with Gen-Z buyers.',
        team_size: '15',
        founded_year: '2023',
        website: 'https://stylesphere.com',
      },
      extendedData: {
        headquarters: 'New York, NY',
        legal_entity_name: 'StyleSphere Inc.',
        incorporation_country: 'United States',
        contact_email: 'founders@stylesphere.com',
        contact_phone: '+12125550144',
        revenue_current_year: '850000',
        monthly_burn: '38000',
        runway_months: '16',
        funding_ask: '3000000',
        funding_use: '40% Creator Economy Partnerships, 35% Computer Vision R&D, 25% Inventory Tech',
      },
      domainData: {
        regulatory_approvals: 'N/A',
        clinical_stage: 'N/A',
        target_patient_population: 'N/A',
        reimbursement_strategy: 'N/A',
        clinical_partners: 'N/A',
        estimated_time_to_market_months: '0',
        licencing_requirements: 'Standard state retail permits',
        payments_volume_30d: '75000',
        kyc_process: 'Merchant verification & buyer fraud protection',
        principal_markets: 'US, UK, Canada',
        integrations: 'Shopify Plus, WooCommerce, Instagram Shop API, TikTok Shop API',
        suppliers: '50+ Verified Sustainable Apparel Brands',
        supply_chain_risks: 'Holiday seasonal logistics backlog',
        perishability_days: 'N/A',
        food_safety_certifications: 'N/A',
        gross_margin_percent: '45',
        primary_channels: 'Shopify App Storefront, iOS/Android Mobile Apps, Instagram & TikTok Shops',
        average_order_value: '115',
        monthly_active_buyers: '28500',
        fulfillment_strategy: 'Distributed 3PL node fulfillment with same-day NYC delivery',
        return_rate_percent: '3.1',
      },
      founderAssetsData: {
        personal_net_worth: '920000',
        liquid_assets: '210000',
        personal_annual_income: '185000',
        credit_score: '795',
        stock_investments: '110000',
        crypto_investments: '45000',
        real_estate_investments: '300000',
        other_investments: '35000',
        primary_residence_value: '720000',
        investment_properties_value: '250000',
        total_real_estate_debt: '380000',
        previous_startup_exits: '750000',
        current_business_equity_value: '1800000',
        intellectual_property_value: '350000',
        business_assets_description: 'Patent-pending 3D human body mesh rendering pipeline & computer vision models',
        personal_debt: '18000',
        monthly_personal_expenses: '6800',
        dependents_count: '1',
        personal_funds_committed_to_startup: '175000',
        previous_funding_raised: '750000',
        investor_connections: 'Forerunner Ventures, Commerce Ventures, LVMH Innovation Award network',
        board_memberships: 'StyleSphere Inc.',
        industry_experience_years: '10',
        previous_companies: 'Ex-Product Lead at Farfetch & Senior AI Engineer at Glossier',
        professional_network_value: 'Extensive fashion retail CTO and luxury brand executive network',
        advisory_roles: 'E-commerce Advisor at Techstars NYC',
        insurance_coverage_amount: '2500000',
        retirement_savings: '210000',
        emergency_fund_months: '9',
        risk_tolerance: 'medium',
      }
    }
  ];

  const handleAutoFill = () => {
    const preset = autoFillPresets[autoFillIndex % autoFillPresets.length];
    
    setBasicData(preset.basicData);
    setExtendedData(preset.extendedData);
    setDomainData(preset.domainData);
    setFounderAssetsData(preset.founderAssetsData);
    
    setAutoFillIndex(prev => prev + 1);

    toast({
      title: `⚡ Loaded Sample (${(autoFillIndex % autoFillPresets.length) + 1}/${autoFillPresets.length}): ${preset.name}`,
      description: 'Form filled only (not submitted). Click again for next domain sample!',
    });
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // First, insert/upsert startup_profiles
      const { data: startupProfile, error: startupError } = await supabase
        .from('startup_profiles')
        .upsert({
          user_id: user.id,
          startup_name: basicData.startup_name,
          industry: basicData.industry || null,
          stage: basicData.stage || null,
          description: basicData.description || null,
          team_size: basicData.team_size ? parseInt(basicData.team_size) : null,
          founded_year: basicData.founded_year ? parseInt(basicData.founded_year) : null,
          website: basicData.website || null,
          headquarters: extendedData.headquarters || null,
          legal_entity_name: extendedData.legal_entity_name || null,
          incorporation_country: extendedData.incorporation_country || null,
          contact_email: extendedData.contact_email || null,
          contact_phone: extendedData.contact_phone ? parseFloat(extendedData.contact_phone) : null,
          revenue_current_year: extendedData.revenue_current_year ? parseFloat(extendedData.revenue_current_year) : null,
          monthly_burn: extendedData.monthly_burn ? parseFloat(extendedData.monthly_burn) : null,
          runway_months: extendedData.runway_months ? parseInt(extendedData.runway_months) : null,
          funding_ask: extendedData.funding_ask ? parseFloat(extendedData.funding_ask) : null,
          funding_use: extendedData.funding_use || null,
          is_complete: true,
        }, {
          onConflict: 'user_id'
        })
        .select()
        .single();

      if (startupError) throw startupError;

      // Then insert domain-specific data if applicable
      if (basicData.industry && startupProfile?.id) {
        let domainError = null;

        switch (basicData.industry) {
          case 'healthcare':
            const { error: healthcareError } = await supabase
              .from('healthcare_details')
              .upsert({
                startup_profile_id: startupProfile.id,
                regulatory_approvals: domainData.regulatory_approvals || null,
                clinical_stage: domainData.clinical_stage || null,
                target_patient_population: domainData.target_patient_population || null,
                reimbursement_strategy: domainData.reimbursement_strategy || null,
                clinical_partners: domainData.clinical_partners || null,
                estimated_time_to_market_months: domainData.estimated_time_to_market_months ? 
                  parseInt(domainData.estimated_time_to_market_months) : null,
              });
            domainError = healthcareError;
            break;

          case 'fintech':
            const { error: fintechError } = await supabase
              .from('fintech_details')
              .upsert({
                startup_profile_id: startupProfile.id,
                licencing_requirements: domainData.licencing_requirements || null,
                payments_volume_30d: domainData.payments_volume_30d ? 
                  parseFloat(domainData.payments_volume_30d) : null,
                kyc_process: domainData.kyc_process || null,
                principal_markets: domainData.principal_markets || null,
                integrations: domainData.integrations || null,
              });
            domainError = fintechError;
            break;

          case 'food':
            const { error: foodError } = await supabase
              .from('food_details')
              .upsert({
                startup_profile_id: startupProfile.id,
                suppliers: domainData.suppliers || null,
                supply_chain_risks: domainData.supply_chain_risks || null,
                perishability_days: domainData.perishability_days ? 
                  parseInt(domainData.perishability_days) : null,
                food_safety_certifications: domainData.food_safety_certifications || null,
                gross_margin_percent: domainData.gross_margin_percent ? 
                  parseFloat(domainData.gross_margin_percent) : null,
              });
            domainError = foodError;
            break;

          case 'ecommerce':
            const { error: ecommerceError } = await supabase
              .from('ecommerce_details')
              .upsert({
                startup_profile_id: startupProfile.id,
                primary_channels: domainData.primary_channels || null,
                average_order_value: domainData.average_order_value ? 
                  parseFloat(domainData.average_order_value) : null,
                monthly_active_buyers: domainData.monthly_active_buyers ? 
                  parseInt(domainData.monthly_active_buyers) : null,
                fulfillment_strategy: domainData.fulfillment_strategy || null,
                return_rate_percent: domainData.return_rate_percent ? 
                  parseFloat(domainData.return_rate_percent) : null,
              });
            domainError = ecommerceError;
            break;
        }

        if (domainError) throw domainError;
      }

      // Insert founder assets data
      const { error: founderAssetsError } = await supabase
        .from('founder_assets')
        .upsert({
          user_id: user.id,
          personal_net_worth: founderAssetsData.personal_net_worth ? parseFloat(founderAssetsData.personal_net_worth) : null,
          liquid_assets: founderAssetsData.liquid_assets ? parseFloat(founderAssetsData.liquid_assets) : null,
          personal_annual_income: founderAssetsData.personal_annual_income ? parseFloat(founderAssetsData.personal_annual_income) : null,
          credit_score: founderAssetsData.credit_score ? parseInt(founderAssetsData.credit_score) : null,
          stock_investments: founderAssetsData.stock_investments ? parseFloat(founderAssetsData.stock_investments) : null,
          crypto_investments: founderAssetsData.crypto_investments ? parseFloat(founderAssetsData.crypto_investments) : null,
          real_estate_investments: founderAssetsData.real_estate_investments ? parseFloat(founderAssetsData.real_estate_investments) : null,
          other_investments: founderAssetsData.other_investments ? parseFloat(founderAssetsData.other_investments) : null,
          primary_residence_value: founderAssetsData.primary_residence_value ? parseFloat(founderAssetsData.primary_residence_value) : null,
          investment_properties_value: founderAssetsData.investment_properties_value ? parseFloat(founderAssetsData.investment_properties_value) : null,
          total_real_estate_debt: founderAssetsData.total_real_estate_debt ? parseFloat(founderAssetsData.total_real_estate_debt) : null,
          previous_startup_exits: founderAssetsData.previous_startup_exits ? parseFloat(founderAssetsData.previous_startup_exits) : null,
          current_business_equity_value: founderAssetsData.current_business_equity_value ? parseFloat(founderAssetsData.current_business_equity_value) : null,
          intellectual_property_value: founderAssetsData.intellectual_property_value ? parseFloat(founderAssetsData.intellectual_property_value) : null,
          business_assets_description: founderAssetsData.business_assets_description || null,
          personal_debt: founderAssetsData.personal_debt ? parseFloat(founderAssetsData.personal_debt) : null,
          monthly_personal_expenses: founderAssetsData.monthly_personal_expenses ? parseFloat(founderAssetsData.monthly_personal_expenses) : null,
          dependents_count: founderAssetsData.dependents_count ? parseInt(founderAssetsData.dependents_count) : null,
          personal_funds_committed_to_startup: founderAssetsData.personal_funds_committed_to_startup ? parseFloat(founderAssetsData.personal_funds_committed_to_startup) : null,
          previous_funding_raised: founderAssetsData.previous_funding_raised ? parseFloat(founderAssetsData.previous_funding_raised) : null,
          investor_connections: founderAssetsData.investor_connections || null,
          board_memberships: founderAssetsData.board_memberships || null,
          industry_experience_years: founderAssetsData.industry_experience_years ? parseInt(founderAssetsData.industry_experience_years) : null,
          previous_companies: founderAssetsData.previous_companies || null,
          professional_network_value: founderAssetsData.professional_network_value || null,
          advisory_roles: founderAssetsData.advisory_roles || null,
          insurance_coverage_amount: founderAssetsData.insurance_coverage_amount ? parseFloat(founderAssetsData.insurance_coverage_amount) : null,
          retirement_savings: founderAssetsData.retirement_savings ? parseFloat(founderAssetsData.retirement_savings) : null,
          emergency_fund_months: founderAssetsData.emergency_fund_months ? parseInt(founderAssetsData.emergency_fund_months) : null,
          risk_tolerance: founderAssetsData.risk_tolerance || null,
        });

      if (founderAssetsError) throw founderAssetsError;

      toast({
        title: 'Profile Complete!',
        description: 'Your startup profile has been created successfully.',
      });

      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="startup_name">Startup Name *</Label>
        <Input
          id="startup_name"
          required
          value={basicData.startup_name}
          onChange={(e) => setBasicData({ ...basicData, startup_name: e.target.value })}
          placeholder="Enter your startup name"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="industry">Industry *</Label>
          <Select value={basicData.industry} onValueChange={(value) => setBasicData({ ...basicData, industry: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="healthcare">Healthcare</SelectItem>
              <SelectItem value="fintech">FinTech</SelectItem>
              <SelectItem value="food">Food & Beverage</SelectItem>
              <SelectItem value="ecommerce">E-commerce</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="stage">Stage *</Label>
          <Select value={basicData.stage} onValueChange={(value) => setBasicData({ ...basicData, stage: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="idea">Idea</SelectItem>
              <SelectItem value="pre-seed">Pre-seed</SelectItem>
              <SelectItem value="seed">Seed</SelectItem>
              <SelectItem value="series-a">Series A</SelectItem>
              <SelectItem value="series-b">Series B+</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          required
          value={basicData.description}
          onChange={(e) => setBasicData({ ...basicData, description: e.target.value })}
          placeholder="Brief description of your startup"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="team_size">Team Size</Label>
          <Input
            id="team_size"
            type="number"
            value={basicData.team_size}
            onChange={(e) => setBasicData({ ...basicData, team_size: e.target.value })}
            placeholder="e.g., 5"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="founded_year">Founded Year</Label>
          <Input
            id="founded_year"
            type="number"
            value={basicData.founded_year}
            onChange={(e) => setBasicData({ ...basicData, founded_year: e.target.value })}
            placeholder="e.g., 2024"
            min="1900"
            max={new Date().getFullYear()}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            type="url"
            value={basicData.website}
            onChange={(e) => setBasicData({ ...basicData, website: e.target.value })}
            placeholder="https://yourwebsite.com"
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="headquarters">Headquarters</Label>
          <Input
            id="headquarters"
            value={extendedData.headquarters}
            onChange={(e) => setExtendedData({ ...extendedData, headquarters: e.target.value })}
            placeholder="e.g., San Francisco, CA"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="legal_entity_name">Legal Entity Name</Label>
          <Input
            id="legal_entity_name"
            value={extendedData.legal_entity_name}
            onChange={(e) => setExtendedData({ ...extendedData, legal_entity_name: e.target.value })}
            placeholder="Legal business name"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="incorporation_country">Incorporation Country</Label>
          <Input
            id="incorporation_country"
            value={extendedData.incorporation_country}
            onChange={(e) => setExtendedData({ ...extendedData, incorporation_country: e.target.value })}
            placeholder="e.g., United States"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact_email">Contact Email</Label>
          <Input
            id="contact_email"
            type="email"
            value={extendedData.contact_email}
            onChange={(e) => setExtendedData({ ...extendedData, contact_email: e.target.value })}
            placeholder="contact@yourstartp.com"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact_phone">Contact Phone</Label>
        <Input
          id="contact_phone"
          type="tel"
          value={extendedData.contact_phone}
          onChange={(e) => setExtendedData({ ...extendedData, contact_phone: e.target.value })}
          placeholder="+1 (555) 123-4567"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="revenue_current_year">Current Year Revenue ($)</Label>
          <Input
            id="revenue_current_year"
            type="number"
            value={extendedData.revenue_current_year}
            onChange={(e) => setExtendedData({ ...extendedData, revenue_current_year: e.target.value })}
            placeholder="e.g., 100000"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="monthly_burn">Monthly Burn ($)</Label>
          <Input
            id="monthly_burn"
            type="number"
            value={extendedData.monthly_burn}
            onChange={(e) => setExtendedData({ ...extendedData, monthly_burn: e.target.value })}
            placeholder="e.g., 25000"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="runway_months">Runway (Months)</Label>
          <Input
            id="runway_months"
            type="number"
            value={extendedData.runway_months}
            onChange={(e) => setExtendedData({ ...extendedData, runway_months: e.target.value })}
            placeholder="e.g., 18"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="funding_ask">Funding Ask ($)</Label>
          <Input
            id="funding_ask"
            type="number"
            value={extendedData.funding_ask}
            onChange={(e) => setExtendedData({ ...extendedData, funding_ask: e.target.value })}
            placeholder="e.g., 2000000"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="funding_use">Use of Funds</Label>
        <Textarea
          id="funding_use"
          value={extendedData.funding_use}
          onChange={(e) => setExtendedData({ ...extendedData, funding_use: e.target.value })}
          placeholder="How will you use the funding?"
          rows={3}
        />
      </div>
    </div>
  );

  const updateDomainData = useCallback((field: string, value: string) => {
    setDomainData(prev => ({ ...prev, [field]: value }));
  }, []);

  const renderHealthcareForm = useMemo(() => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="regulatory_approvals">Regulatory Approvals</Label>
        <Textarea
          id="regulatory_approvals"
          value={domainData.regulatory_approvals}
          onChange={(e) => updateDomainData('regulatory_approvals', e.target.value)}
          placeholder="FDA approvals, clinical trial status, etc."
          rows={2}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="clinical_stage">Clinical Stage</Label>
          <Input
            id="clinical_stage"
            value={domainData.clinical_stage}
            onChange={(e) => updateDomainData('clinical_stage', e.target.value)}
            placeholder="e.g., Phase II, Pre-clinical"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="estimated_time_to_market_months">Time to Market (Months)</Label>
          <Input
            id="estimated_time_to_market_months"
            type="number"
            value={domainData.estimated_time_to_market_months}
            onChange={(e) => updateDomainData('estimated_time_to_market_months', e.target.value)}
            placeholder="e.g., 24"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="target_patient_population">Target Patient Population</Label>
        <Input
          id="target_patient_population"
          value={domainData.target_patient_population}
          onChange={(e) => updateDomainData('target_patient_population', e.target.value)}
          placeholder="e.g., Diabetes patients, Cancer patients"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="reimbursement_strategy">Reimbursement Strategy</Label>
        <Textarea
          id="reimbursement_strategy"
          value={domainData.reimbursement_strategy}
          onChange={(e) => updateDomainData('reimbursement_strategy', e.target.value)}
          placeholder="Insurance coverage, Medicare/Medicaid, etc."
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="clinical_partners">Clinical Partners</Label>
        <Input
          id="clinical_partners"
          value={domainData.clinical_partners}
          onChange={(e) => updateDomainData('clinical_partners', e.target.value)}
          placeholder="Hospitals, research institutions, etc."
        />
      </div>
    </div>
  ), [domainData.regulatory_approvals, domainData.clinical_stage, domainData.estimated_time_to_market_months, domainData.target_patient_population, domainData.reimbursement_strategy, domainData.clinical_partners, updateDomainData]);

  const renderFintechForm = useMemo(() => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="licencing_requirements">Licensing Requirements</Label>
        <Textarea
          id="licencing_requirements"
          value={domainData.licencing_requirements}
          onChange={(e) => updateDomainData('licencing_requirements', e.target.value)}
          placeholder="Banking licenses, money transmitter licenses, etc."
          rows={2}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="payments_volume_30d">30-Day Payment Volume ($)</Label>
          <Input
            id="payments_volume_30d"
            type="number"
            value={domainData.payments_volume_30d}
            onChange={(e) => updateDomainData('payments_volume_30d', e.target.value)}
            placeholder="e.g., 500000"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="principal_markets">Principal Markets</Label>
          <Input
            id="principal_markets"
            value={domainData.principal_markets}
            onChange={(e) => updateDomainData('principal_markets', e.target.value)}
            placeholder="e.g., US, EU, APAC"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="kyc_process">KYC Process</Label>
        <Textarea
          id="kyc_process"
          value={domainData.kyc_process}
          onChange={(e) => updateDomainData('kyc_process', e.target.value)}
          placeholder="Customer verification and compliance processes"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="integrations">Key Integrations</Label>
        <Input
          id="integrations"
          value={domainData.integrations}
          onChange={(e) => updateDomainData('integrations', e.target.value)}
          placeholder="Banking APIs, payment processors, etc."
        />
      </div>
    </div>
  ), [domainData.licencing_requirements, domainData.payments_volume_30d, domainData.principal_markets, domainData.kyc_process, domainData.integrations, updateDomainData]);

  const renderFoodForm = useMemo(() => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="suppliers">Key Suppliers</Label>
        <Textarea
          id="suppliers"
          value={domainData.suppliers}
          onChange={(e) => updateDomainData('suppliers', e.target.value)}
          placeholder="Primary ingredient and packaging suppliers"
          rows={2}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="perishability_days">Shelf Life (Days)</Label>
          <Input
            id="perishability_days"
            type="number"
            value={domainData.perishability_days}
            onChange={(e) => updateDomainData('perishability_days', e.target.value)}
            placeholder="e.g., 30"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gross_margin_percent">Gross Margin (%)</Label>
          <Input
            id="gross_margin_percent"
            type="number"
            value={domainData.gross_margin_percent}
            onChange={(e) => updateDomainData('gross_margin_percent', e.target.value)}
            placeholder="e.g., 45"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="supply_chain_risks">Supply Chain Risks</Label>
        <Textarea
          id="supply_chain_risks"
          value={domainData.supply_chain_risks}
          onChange={(e) => updateDomainData('supply_chain_risks', e.target.value)}
          placeholder="Potential disruptions and mitigation strategies"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="food_safety_certifications">Food Safety Certifications</Label>
        <Input
          id="food_safety_certifications"
          value={domainData.food_safety_certifications}
          onChange={(e) => updateDomainData('food_safety_certifications', e.target.value)}
          placeholder="FDA, USDA, organic certifications, etc."
        />
      </div>
    </div>
  ), [domainData.suppliers, domainData.perishability_days, domainData.gross_margin_percent, domainData.supply_chain_risks, domainData.food_safety_certifications, updateDomainData]);

  const renderEcommerceForm = useMemo(() => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="primary_channels">Primary Sales Channels</Label>
        <Input
          id="primary_channels"
          value={domainData.primary_channels}
          onChange={(e) => updateDomainData('primary_channels', e.target.value)}
          placeholder="e.g., Website, Amazon, Shopify, Retail"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="average_order_value">Average Order Value ($)</Label>
          <Input
            id="average_order_value"
            type="number"
            value={domainData.average_order_value}
            onChange={(e) => updateDomainData('average_order_value', e.target.value)}
            placeholder="e.g., 75"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="monthly_active_buyers">Monthly Active Buyers</Label>
          <Input
            id="monthly_active_buyers"
            type="number"
            value={domainData.monthly_active_buyers}
            onChange={(e) => updateDomainData('monthly_active_buyers', e.target.value)}
            placeholder="e.g., 1500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="return_rate_percent">Return Rate (%)</Label>
          <Input
            id="return_rate_percent"
            type="number"
            value={domainData.return_rate_percent}
            onChange={(e) => updateDomainData('return_rate_percent', e.target.value)}
            placeholder="e.g., 5"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fulfillment_strategy">Fulfillment Strategy</Label>
          <Input
            id="fulfillment_strategy"
            value={domainData.fulfillment_strategy}
            onChange={(e) => updateDomainData('fulfillment_strategy', e.target.value)}
            placeholder="e.g., In-house, 3PL, Dropship"
          />
        </div>
      </div>
    </div>
  ), [domainData.primary_channels, domainData.average_order_value, domainData.monthly_active_buyers, domainData.return_rate_percent, domainData.fulfillment_strategy, updateDomainData]);

  const renderStep3 = () => {
    if (!basicData.industry) {
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Please select an industry in Step 1 to continue.</p>
        </div>
      );
    }
    const ind = (basicData.industry || '').toLowerCase();
    let currentForm = renderFintechForm;
    if (ind.includes('health')) currentForm = renderHealthcareForm;
    else if (ind.includes('fintech')) currentForm = renderFintechForm;
    else if (ind.includes('food')) currentForm = renderFoodForm;
    else if (ind.includes('ecom') || ind.includes('commerce')) currentForm = renderEcommerceForm;
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold capitalize">{basicData.industry} Specific Details</h3>
          <p className="text-sm text-muted-foreground">Provide industry-specific information to enhance your profile</p>
        </div>
        {currentForm}
      </div>
    );
  };

  const renderStep4 = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-lg font-semibold">Founder Assets & Financial Profile</h3>
        <p className="text-sm text-muted-foreground">Provide your financial background and assets to strengthen your founder profile</p>
      </div>

      {/* Personal Financial Information */}
      <div className="space-y-4">
        <h4 className="text-md font-semibold text-primary">Personal Financial Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="personal_net_worth">Personal Net Worth ($)</Label>
            <Input
              id="personal_net_worth"
              type="number"
              value={founderAssetsData.personal_net_worth}
              onChange={(e) => setFounderAssetsData({ ...founderAssetsData, personal_net_worth: e.target.value })}
              placeholder="e.g., 500000"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="liquid_assets">Liquid Assets ($)</Label>
            <Input
              id="liquid_assets"
              type="number"
              value={founderAssetsData.liquid_assets}
              onChange={(e) => setFounderAssetsData({ ...founderAssetsData, liquid_assets: e.target.value })}
              placeholder="e.g., 100000"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="personal_annual_income">Annual Income ($)</Label>
            <Input
              id="personal_annual_income"
              type="number"
              value={founderAssetsData.personal_annual_income}
              onChange={(e) => setFounderAssetsData({ ...founderAssetsData, personal_annual_income: e.target.value })}
              placeholder="e.g., 150000"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="credit_score">Credit Score</Label>
            <Input
              id="credit_score"
              type="number"
              min="300"
              max="850"
              value={founderAssetsData.credit_score}
              onChange={(e) => setFounderAssetsData({ ...founderAssetsData, credit_score: e.target.value })}
              placeholder="e.g., 750"
            />
          </div>
        </div>
      </div>

      {/* Investment Portfolio */}
      <div className="space-y-4">
        <h4 className="text-md font-semibold text-primary">Investment Portfolio</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="stock_investments">Stock Investments ($)</Label>
            <Input
              id="stock_investments"
              type="number"
              value={founderAssetsData.stock_investments}
              onChange={(e) => setFounderAssetsData({ ...founderAssetsData, stock_investments: e.target.value })}
              placeholder="e.g., 50000"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="crypto_investments">Crypto Investments ($)</Label>
            <Input
              id="crypto_investments"
              type="number"
              value={founderAssetsData.crypto_investments}
              onChange={(e) => setFounderAssetsData({ ...founderAssetsData, crypto_investments: e.target.value })}
              placeholder="e.g., 25000"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="real_estate_investments">Real Estate Investments ($)</Label>
            <Input
              id="real_estate_investments"
              type="number"
              value={founderAssetsData.real_estate_investments}
              onChange={(e) => setFounderAssetsData({ ...founderAssetsData, real_estate_investments: e.target.value })}
              placeholder="e.g., 200000"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="other_investments">Other Investments ($)</Label>
            <Input
              id="other_investments"
              type="number"
              value={founderAssetsData.other_investments}
              onChange={(e) => setFounderAssetsData({ ...founderAssetsData, other_investments: e.target.value })}
              placeholder="e.g., 30000"
            />
          </div>
        </div>
      </div>

      {/* Real Estate Assets */}
      <div className="space-y-4">
        <h4 className="text-md font-semibold text-primary">Real Estate Assets</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="primary_residence_value">Primary Residence Value ($)</Label>
            <Input
              id="primary_residence_value"
              type="number"
              value={founderAssetsData.primary_residence_value}
              onChange={(e) => setFounderAssetsData({ ...founderAssetsData, primary_residence_value: e.target.value })}
              placeholder="e.g., 600000"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="investment_properties_value">Investment Properties Value ($)</Label>
            <Input
              id="investment_properties_value"
              type="number"
              value={founderAssetsData.investment_properties_value}
              onChange={(e) => setFounderAssetsData({ ...founderAssetsData, investment_properties_value: e.target.value })}
              placeholder="e.g., 400000"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="total_real_estate_debt">Total Real Estate Debt ($)</Label>
            <Input
              id="total_real_estate_debt"
              type="number"
              value={founderAssetsData.total_real_estate_debt}
              onChange={(e) => setFounderAssetsData({ ...founderAssetsData, total_real_estate_debt: e.target.value })}
              placeholder="e.g., 300000"
            />
          </div>
        </div>
      </div>

      {/* Business Assets & Equity */}
      <div className="space-y-4">
        <h4 className="text-md font-semibold text-primary">Business Assets & Equity</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="previous_startup_exits">Previous Startup Exits ($)</Label>
            <Input
              id="previous_startup_exits"
              type="number"
              value={founderAssetsData.previous_startup_exits}
              onChange={(e) => setFounderAssetsData({ ...founderAssetsData, previous_startup_exits: e.target.value })}
              placeholder="e.g., 1000000"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="current_business_equity_value">Current Business Equity Value ($)</Label>
            <Input
              id="current_business_equity_value"
              type="number"
              value={founderAssetsData.current_business_equity_value}
              onChange={(e) => setFounderAssetsData({ ...founderAssetsData, current_business_equity_value: e.target.value })}
              placeholder="e.g., 500000"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="intellectual_property_value">Intellectual Property Value ($)</Label>
            <Input
              id="intellectual_property_value"
              type="number"
              value={founderAssetsData.intellectual_property_value}
              onChange={(e) => setFounderAssetsData({ ...founderAssetsData, intellectual_property_value: e.target.value })}
              placeholder="e.g., 100000"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="business_assets_description">Business Assets Description</Label>
          <Textarea
            id="business_assets_description"
            value={founderAssetsData.business_assets_description}
            onChange={(e) => setFounderAssetsData({ ...founderAssetsData, business_assets_description: e.target.value })}
            placeholder="Describe your business-related assets, IP, partnerships, etc."
            rows={3}
          />
        </div>
      </div>

      {/* Financial Commitments */}
      <div className="space-y-4">
        <h4 className="text-md font-semibold text-primary">Financial Commitments</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="personal_debt">Personal Debt ($)</Label>
            <Input
              id="personal_debt"
              type="number"
              value={founderAssetsData.personal_debt}
              onChange={(e) => setFounderAssetsData({ ...founderAssetsData, personal_debt: e.target.value })}
              placeholder="e.g., 50000"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="monthly_personal_expenses">Monthly Personal Expenses ($)</Label>
            <Input
              id="monthly_personal_expenses"
              type="number"
              value={founderAssetsData.monthly_personal_expenses}
              onChange={(e) => setFounderAssetsData({ ...founderAssetsData, monthly_personal_expenses: e.target.value })}
              placeholder="e.g., 8000"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dependents_count">Number of Dependents</Label>
            <Input
              id="dependents_count"
              type="number"
              min="0"
              value={founderAssetsData.dependents_count}
              onChange={(e) => setFounderAssetsData({ ...founderAssetsData, dependents_count: e.target.value })}
              placeholder="e.g., 2"
            />
          </div>
        </div>
      </div>

      {/* Funding & Investment Details */}
      <div className="space-y-4">
        <h4 className="text-md font-semibold text-primary">Funding & Investment Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="personal_funds_committed_to_startup">Personal Funds Committed to Startup ($)</Label>
            <Input
              id="personal_funds_committed_to_startup"
              type="number"
              value={founderAssetsData.personal_funds_committed_to_startup}
              onChange={(e) => setFounderAssetsData({ ...founderAssetsData, personal_funds_committed_to_startup: e.target.value })}
              placeholder="e.g., 100000"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="previous_funding_raised">Previous Funding Raised ($)</Label>
            <Input
              id="previous_funding_raised"
              type="number"
              value={founderAssetsData.previous_funding_raised}
              onChange={(e) => setFounderAssetsData({ ...founderAssetsData, previous_funding_raised: e.target.value })}
              placeholder="e.g., 500000"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="investor_connections">Investor Connections</Label>
            <Textarea
              id="investor_connections"
              value={founderAssetsData.investor_connections}
              onChange={(e) => setFounderAssetsData({ ...founderAssetsData, investor_connections: e.target.value })}
              placeholder="List key investor relationships, VCs, angels, etc."
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="board_memberships">Board Memberships</Label>
            <Textarea
              id="board_memberships"
              value={founderAssetsData.board_memberships}
              onChange={(e) => setFounderAssetsData({ ...founderAssetsData, board_memberships: e.target.value })}
              placeholder="Companies where you serve on the board"
              rows={2}
            />
          </div>
        </div>
      </div>

      {/* Professional Assets */}
      <div className="space-y-4">
        <h4 className="text-md font-semibold text-primary">Professional Assets</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="industry_experience_years">Industry Experience (Years)</Label>
            <Input
              id="industry_experience_years"
              type="number"
              min="0"
              value={founderAssetsData.industry_experience_years}
              onChange={(e) => setFounderAssetsData({ ...founderAssetsData, industry_experience_years: e.target.value })}
              placeholder="e.g., 10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="previous_companies">Previous Companies</Label>
            <Textarea
              id="previous_companies"
              value={founderAssetsData.previous_companies}
              onChange={(e) => setFounderAssetsData({ ...founderAssetsData, previous_companies: e.target.value })}
              placeholder="List previous work experience and companies"
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="professional_network_value">Professional Network Value</Label>
            <Textarea
              id="professional_network_value"
              value={founderAssetsData.professional_network_value}
              onChange={(e) => setFounderAssetsData({ ...founderAssetsData, professional_network_value: e.target.value })}
              placeholder="Describe the strength and value of your professional network"
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="advisory_roles">Advisory Roles</Label>
            <Textarea
              id="advisory_roles"
              value={founderAssetsData.advisory_roles}
              onChange={(e) => setFounderAssetsData({ ...founderAssetsData, advisory_roles: e.target.value })}
              placeholder="Current advisory positions and roles"
              rows={2}
            />
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="space-y-4">
        <h4 className="text-md font-semibold text-primary">Additional Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="insurance_coverage_amount">Insurance Coverage ($)</Label>
            <Input
              id="insurance_coverage_amount"
              type="number"
              value={founderAssetsData.insurance_coverage_amount}
              onChange={(e) => setFounderAssetsData({ ...founderAssetsData, insurance_coverage_amount: e.target.value })}
              placeholder="e.g., 1000000"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="retirement_savings">Retirement Savings ($)</Label>
            <Input
              id="retirement_savings"
              type="number"
              value={founderAssetsData.retirement_savings}
              onChange={(e) => setFounderAssetsData({ ...founderAssetsData, retirement_savings: e.target.value })}
              placeholder="e.g., 200000"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="emergency_fund_months">Emergency Fund (Months)</Label>
            <Input
              id="emergency_fund_months"
              type="number"
              min="0"
              value={founderAssetsData.emergency_fund_months}
              onChange={(e) => setFounderAssetsData({ ...founderAssetsData, emergency_fund_months: e.target.value })}
              placeholder="e.g., 6"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="risk_tolerance">Risk Tolerance</Label>
            <Select value={founderAssetsData.risk_tolerance} onValueChange={(value) => setFounderAssetsData({ ...founderAssetsData, risk_tolerance: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select risk tolerance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return basicData.startup_name && basicData.industry && basicData.stage && basicData.description;
      case 2:
        return true; // Step 2 is optional
      case 3:
        return true; // Step 3 is optional
      case 4:
        return true; // Step 4 is optional
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 py-12">
      <div className="max-w-4xl mx-auto">
        <Card className="border-primary/20 shadow-glow-sm">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-2xl">Complete Your Startup Profile</CardTitle>
                <CardDescription>
                  Step {currentStep} of {totalSteps}: {
                    currentStep === 1 ? 'Basic Information' : 
                    currentStep === 2 ? 'Company Details' : 
                    currentStep === 3 ? `${basicData.industry ? basicData.industry.charAt(0).toUpperCase() + basicData.industry.slice(1) : 'Industry'} Specific Details` :
                    'Founder Assets & Financial Profile'
                  }
                </CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAutoFill}
                  className="flex items-center gap-1.5 border-primary/40 text-primary hover:bg-primary/10 transition-all shadow-sm font-medium"
                >
                  <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
                  <span>Auto-Fill Demo Data</span>
                </Button>
                <div className="flex space-x-1.5">
                  {Array.from({ length: totalSteps }, (_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-full ${
                        i + 1 < currentStep ? 'bg-primary' : 
                        i + 1 === currentStep ? 'bg-primary/50' : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
              {currentStep === 4 && renderStep4()}

              <div className="flex items-center justify-between gap-3 pt-6 border-t border-border/50">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </Button>

                {currentStep < totalSteps ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={!isStepValid(currentStep)}
                    className="flex items-center gap-2"
                  >
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={loading || !isStepValid(1)}
                    className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-primary text-white hover:from-emerald-700 hover:to-primary/90 shadow-md font-semibold px-6"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Profile...
                      </>
                    ) : (
                      <>
                        <Check className="w-5 h-5" />
                        Submit & Create Profile
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompleteProfile;
