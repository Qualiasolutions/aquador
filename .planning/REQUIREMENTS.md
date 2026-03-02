# Requirements: Critical Security Vulnerabilities Milestone

**Milestone**: Critical Security Vulnerabilities
**Approach**: Aggressive, comprehensive security overhaul
**Timeline**: Immediate priority - security vulnerabilities are production-blocking

---

## Functional Requirements

### 1. Admin API Route Security (CRITICAL)
**Requirement**: All admin API routes must enforce proper authentication and authorization

**Acceptance Criteria**:
- [ ] `/api/admin/orders` route has direct auth check (not relying on middleware)
- [ ] Auth check verifies user exists in `admin_users` table
- [ ] Route returns 401 for unauthenticated requests, 403 for non-admin users
- [ ] Test coverage for auth bypass scenarios
- [ ] No admin API routes are accessible without proper authentication

**Files Affected**:
- `src/app/api/admin/orders/route.ts` (primary fix)
- Any other `/api/admin/*` routes discovered

### 2. Row Level Security Verification (CRITICAL)
**Requirement**: All database tables must have proper RLS policies configured and verified

**Acceptance Criteria**:
- [ ] RLS status confirmed for ALL tables: `products`, `orders`, `customers`, `admin_users`, `blog_posts`, `gift_set_inventory`
- [ ] Missing RLS policies created and applied
- [ ] RLS policies tested to prevent unauthorized data access
- [ ] Database schema exported to version control for audit trail
- [ ] Documentation of all RLS policies created

**Implementation**:
- Export current schema from Supabase
- Identify tables missing RLS
- Create appropriate policies for each table
- Test policies with different user roles

### 3. Bundle Optimization (HIGH)
**Requirement**: Remove 9,067-line static products catalog that duplicates Supabase data

**Acceptance Criteria**:
- [ ] `src/lib/products.ts` file completely removed
- [ ] All imports of static product data migrated to `src/lib/supabase/product-service.ts`
- [ ] AI assistant catalog data updated to use Supabase queries
- [ ] Build bundle size reduced by 200-400KB
- [ ] All existing functionality preserved (no breaking changes)
- [ ] Performance maintained or improved with database queries

**Migration Scope**:
- Product listing pages
- Search functionality
- AI assistant product recommendations
- Related products logic
- Category filtering

### 4. Comprehensive Input Validation (MEDIUM)
**Requirement**: All API routes must validate input with Zod schemas

**Acceptance Criteria**:
- [ ] Zod schemas created for ALL API routes accepting user input
- [ ] Input validation covers: type checking, required fields, format validation, business rules
- [ ] Proper error responses with field-specific validation messages
- [ ] No API route accepts unvalidated user input

**Routes to validate**:
- `/api/checkout` (cart items, customer data)
- `/api/create-perfume/payment` (perfume composition, pricing)
- `/api/ai-assistant` (chat messages, context)
- `/api/admin/orders` (order data)
- `/api/blog` POST/PUT (blog content, metadata)
- `/api/heartbeat` (visitor tracking data)

### 5. Production Logging Cleanup (LOW)
**Requirement**: Replace console.log statements with structured logging

**Acceptance Criteria**:
- [ ] All 10 console.log statements replaced with Sentry logging
- [ ] Structured logging with appropriate log levels (info, warn, error)
- [ ] No sensitive data (PII, payment info) in logs
- [ ] Development vs production logging configuration

---

## Technical Requirements

### Performance
- Build bundle size reduced by minimum 200KB
- Database query performance maintained or improved
- No regression in page load times
- ISR caching still functional after product data migration

### Security
- Zero unprotected admin endpoints
- All tables have appropriate RLS policies
- Input validation prevents malformed data crashes
- No hardcoded secrets or sensitive data in logs

### Reliability
- All existing functionality preserved
- Comprehensive test coverage for security fixes
- Rollback plan for each major change
- Atomic commits for easy reversion if needed

### Maintainability
- Database schema in version control
- Clear documentation of security policies
- Consistent input validation patterns across API routes
- Proper error handling and logging

---

## Non-Functional Requirements

### Risk Management
- **Approach**: Aggressive but safe - rapid security fixes with thorough testing
- **Testing**: Each fix must be tested before moving to next issue
- **Rollback**: Each commit must be atomic and revertible
- **Verification**: Manual security testing after each fix

### Quality Gates
- [ ] `npx tsc --noEmit` passes after each change
- [ ] `npm run build` succeeds after each change
- [ ] All existing E2E tests still pass
- [ ] Security testing confirms vulnerabilities are fixed
- [ ] No new vulnerabilities introduced

### Documentation Requirements
- Update CLAUDE.md if API contracts change
- Document all RLS policies created
- Update .env.example if new environment variables needed
- Security fix changelog for audit trail

---

## Success Criteria

### Primary (Must Have)
1. **Admin API security verified** - No unauthorized access possible
2. **RLS policies confirmed** - All data protected at database level
3. **Bundle optimized** - Static product catalog removed, performance improved
4. **Input validation complete** - All API routes have Zod schemas

### Secondary (Should Have)
5. **Logging cleaned up** - Production-ready structured logging
6. **Schema documented** - Database structure in version control
7. **Test coverage** - Security fixes have comprehensive tests

### Verification Gate
- Manual security testing confirms all vulnerabilities are resolved
- Audit tool re-run shows improved security grade (B → A+)
- Bundle analysis confirms size reduction
- All functionality verified working after migration

---

## Constraints & Assumptions

### Constraints
- **No breaking changes** to existing user-facing functionality
- **Preserve all data** - no deletion of products, orders, or records
- **Maintain performance** - database migration must not slow down the site
- **Test mode payments** - keep Stripe in test mode during development

### Assumptions
- Supabase database has sufficient performance for product queries
- Current static product data matches Supabase product data
- Admin authentication middleware works correctly for other routes
- RLS can be safely enabled without breaking existing functionality

### Dependencies
- Access to Supabase project admin dashboard
- Ability to modify database schema and RLS policies
- Test environment to verify security fixes
- Sentry configuration for structured logging

---

**Requirements Approved**: Ready for roadmap creation and phase planning