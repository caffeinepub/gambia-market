import SectionContainer from './SectionContainer';
import FeatureCard from './FeatureCard';
import RegistrationFlowCard from './RegistrationFlowCard';
import ListingCreationCard from './ListingCreationCard';
import HomeFeedMockup from './HomeFeedMockup';
import SearchFilterMockup from './SearchFilterMockup';
import ChatMockup from './ChatMockup';
import VerifiedBadgeMockup from './VerifiedBadgeMockup';
import FulfillmentOptionsCard from './FulfillmentOptionsCard';
import PaymentMethodsMockup from './PaymentMethodsMockup';
import TrustSafetyMockup from './TrustSafetyMockup';
import { features } from '../data/features';

export default function FeatureBreakdownSection() {
  return (
    <SectionContainer
      title="Core Feature Breakdown"
      subtitle="10 essential features that make Gambia Market the go-to local marketplace for everyday Gambians."
    >
      <div className="space-y-8">
        {features.map((feature) => (
          <div key={feature.id} className="bg-card/50 border border-border rounded-3xl p-5 shadow-card">
            {/* Feature card header */}
            <FeatureCard feature={feature} />

            {/* REQ-13: Phone registration flow */}
            {feature.flowSteps && (
              <RegistrationFlowCard flowSteps={feature.flowSteps} />
            )}

            {/* REQ-14: Listing creation steps */}
            {feature.creationSteps && (
              <ListingCreationCard creationSteps={feature.creationSteps} />
            )}

            {/* REQ-15: Home feed mockup */}
            {feature.sampleListings && (
              <HomeFeedMockup listings={feature.sampleListings} />
            )}

            {/* REQ-16: Search & filters */}
            {feature.filterOptions && (
              <SearchFilterMockup filterOptions={feature.filterOptions} />
            )}

            {/* REQ-17: In-app chat */}
            {feature.chatDemo && (
              <ChatMockup chatDemo={feature.chatDemo} />
            )}

            {/* REQ-18: Verified seller badge */}
            {feature.verificationProcess && feature.sampleProfile && (
              <VerifiedBadgeMockup
                verificationProcess={feature.verificationProcess}
                sampleProfile={feature.sampleProfile}
              />
            )}

            {/* REQ-19: Delivery & meet-up */}
            {feature.fulfillmentOptions && (
              <FulfillmentOptionsCard fulfillmentOptions={feature.fulfillmentOptions} />
            )}

            {/* REQ-20: Mobile money payments */}
            {feature.paymentMethods && feature.transactionStates && (
              <PaymentMethodsMockup
                paymentMethods={feature.paymentMethods}
                transactionStates={feature.transactionStates}
              />
            )}

            {/* REQ-21: Trust & safety */}
            {feature.trustMechanisms && (
              <TrustSafetyMockup trustMechanisms={feature.trustMechanisms} />
            )}
          </div>
        ))}
      </div>
    </SectionContainer>
  );
}
