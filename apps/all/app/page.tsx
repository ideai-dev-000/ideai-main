/**
 * @fileoverview UI Showcase page for the IdeaI /all demo site
 * 
 * @module AllAppPage
 * @description
 * Comprehensive UI component showcase page displaying all IdeaI components,
 * shadcn/ui elements, and Tailwind utilities.
 * This page serves as a complete reference for all available UI elements.
 * 
 * @example
 * This page is automatically rendered at the root route (/)
 * 
 * @see {@link ../layout.tsx} - Root layout component
 * @see {@link @repo/ui/components} - All shared components
 */

import { IdeaIHeader } from "@repo/ui/components/ideai-header";
import { IdeAIFooter } from "@repo/ui/components/ideai-footer";
import { IdeaIButton } from "@repo/ui/components/ideai-button";
import { Button } from "@repo/ui/components/ui/button";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <IdeaIHeader siteName="/all" subtitle="Complete UI Component Showcase">
          <IdeaIButton appName="all">Open alert</IdeaIButton>
        </IdeaIHeader>
        
        <div className={styles.showcase}>
          {/* Buttons Section */}
          <section className={styles.showcase__section}>
            <h2 className={styles.showcase__sectionTitle}>Buttons</h2>
            
            <div className={styles.showcase__component}>
              <div className={styles.showcase__componentLabel}>IdeaI Button (Secondary)</div>
              <div className={styles.showcase__demo}>
                <IdeaIButton appName="all">IdeaI Button</IdeaIButton>
              </div>
            </div>
            
            <div className={styles.showcase__component}>
              <div className={styles.showcase__componentLabel}>shadcn Button (Default)</div>
              <div className={styles.showcase__demo}>
                <Button>Default Button</Button>
              </div>
            </div>
            
            <div className={styles.showcase__component}>
              <div className={styles.showcase__componentLabel}>shadcn Button (Destructive)</div>
              <div className={styles.showcase__demo}>
                <Button variant="destructive">Destructive</Button>
              </div>
            </div>
            
            <div className={styles.showcase__component}>
              <div className={styles.showcase__componentLabel}>shadcn Button (Outline)</div>
              <div className={styles.showcase__demo}>
                <Button variant="outline">Outline</Button>
              </div>
            </div>
            
            <div className={styles.showcase__component}>
              <div className={styles.showcase__componentLabel}>shadcn Button (Ghost)</div>
              <div className={styles.showcase__demo}>
                <Button variant="ghost">Ghost</Button>
              </div>
            </div>
            
            <div className={styles.showcase__component}>
              <div className={styles.showcase__componentLabel}>shadcn Button (Link)</div>
              <div className={styles.showcase__demo}>
                <Button variant="link">Link</Button>
              </div>
            </div>
            
            <div className={styles.showcase__component}>
              <div className={styles.showcase__componentLabel}>shadcn Button (Sizes)</div>
              <div className={styles.showcase__demo}>
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
              </div>
            </div>
          </section>
          
          {/* Typography Section */}
          <section className={styles.showcase__section}>
            <h2 className={styles.showcase__sectionTitle}>Typography</h2>
            
            <div className={styles.showcase__component}>
              <div className={styles.showcase__componentLabel}>Headings</div>
              <div className={styles.showcase__demo}>
                <h1>Heading 1 - Lorem ipsum dolor sit amet</h1>
                <h2>Heading 2 - Consectetur adipiscing elit</h2>
                <h3>Heading 3 - Sed do eiusmod tempor</h3>
                <h4>Heading 4 - Incididunt ut labore</h4>
                <h5>Heading 5 - Et dolore magna aliqua</h5>
                <h6>Heading 6 - Ut enim ad minim veniam</h6>
              </div>
            </div>
            
            <div className={styles.showcase__component}>
              <div className={styles.showcase__componentLabel}>Body Text</div>
              <div className={styles.showcase__demo}>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
                <p><strong>Strong text:</strong> Ut enim ad minim veniam, quis nostrud exercitation.</p>
                <p><em>Emphasized text:</em> Duis aute irure dolor in reprehenderit.</p>
                <p><small>Small text:</small> Excepteur sint occaecat cupidatat non proident.</p>
              </div>
            </div>
            
            <div className={styles.showcase__component}>
              <div className={styles.showcase__componentLabel}>Lists</div>
              <div className={styles.showcase__demo}>
                <ul>
                  <li>Unordered list item 1</li>
                  <li>Unordered list item 2</li>
                  <li>Unordered list item 3</li>
                </ul>
                <ol>
                  <li>Ordered list item 1</li>
                  <li>Ordered list item 2</li>
                  <li>Ordered list item 3</li>
                </ol>
              </div>
            </div>
            
            <div className={styles.showcase__component}>
              <div className={styles.showcase__componentLabel}>Code & Pre</div>
              <div className={styles.showcase__demo}>
                <p>Inline <code>code</code> example</p>
                <pre><code>const example = "code block";</code></pre>
              </div>
            </div>
          </section>
          
          {/* Links Section */}
          <section className={styles.showcase__section}>
            <h2 className={styles.showcase__sectionTitle}>Links</h2>
            
            <div className={styles.showcase__component}>
              <div className={styles.showcase__componentLabel}>Standard Links</div>
              <div className={styles.showcase__demo}>
                <a href="#example">Internal link</a>
                <a href="https://example.com" target="_blank" rel="noopener noreferrer">External link</a>
              </div>
            </div>
          </section>
          
          {/* Form Elements Section */}
          <section className={styles.showcase__section}>
            <h2 className={styles.showcase__sectionTitle}>Form Elements</h2>
            
            <div className={styles.showcase__component}>
              <div className={styles.showcase__componentLabel}>Input Fields</div>
              <div className={styles.showcase__demo}>
                <input type="text" placeholder="Text input" />
                <input type="email" placeholder="Email input" />
                <input type="password" placeholder="Password input" />
                <textarea placeholder="Textarea"></textarea>
              </div>
            </div>
            
            <div className={styles.showcase__component}>
              <div className={styles.showcase__componentLabel}>Checkboxes & Radio</div>
              <div className={styles.showcase__demo}>
                <label><input type="checkbox" /> Checkbox 1</label>
                <label><input type="checkbox" checked /> Checkbox 2 (checked)</label>
                <label><input type="radio" name="radio" /> Radio 1</label>
                <label><input type="radio" name="radio" checked /> Radio 2 (checked)</label>
              </div>
            </div>
            
            <div className={styles.showcase__component}>
              <div className={styles.showcase__componentLabel}>Select</div>
              <div className={styles.showcase__demo}>
                <select>
                  <option>Option 1</option>
                  <option>Option 2</option>
                  <option>Option 3</option>
                </select>
              </div>
            </div>
          </section>
          
          {/* Footer Component */}
          <section className={styles.showcase__section}>
            <h2 className={styles.showcase__sectionTitle}>Footer Component</h2>
            <div className={styles.showcase__component}>
              <div className={styles.showcase__componentLabel}>IdeAIFooter</div>
              <div className={styles.showcase__demo}>
                <IdeAIFooter />
              </div>
            </div>
          </section>
        </div>
      </main>
      <IdeAIFooter />
    </div>
  );
}

