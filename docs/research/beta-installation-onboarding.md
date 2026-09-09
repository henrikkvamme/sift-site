# Sift beta installation

Research and implementation decision, 9 September 2026.

## Recommendation

Send the early-tester CTA straight to a dedicated installation page. Attempt a same-origin ZIP download on the first desktop Chromium visit, keep a visible download link, and show three persistent steps: unzip, open Extensions, load the folder. Do not add an email gate, a wizard, or a tutorial video. This is an installation bridge while the Store release is pending, not a separate onboarding product.

The download page cannot observe whether the user extracted the ZIP or enabled an extension. It should never infer completion from elapsed time, advance steps automatically, or display a made-up progress bar. The final action simply opens YouTube, where the user can verify the result.

## Evidence and implications

### Follow Chrome's actual installation sequence

Google documents Developer mode, Load unpacked, and selecting the extension directory. Its tutorial explicitly says chrome:// addresses are not linkable. A normal website should therefore offer the exact selectable address and a copy button, with a short instruction to paste it into a new tab. A decorative link that silently fails would make the walkthrough worse. [Chrome installation tutorial](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world)

Private and unlisted Store distribution still involve review. They do not provide an immediate way around the pending review. Keep the submitted Store release intact and distribute a distinct, clearly labeled beta artifact for testers comfortable with manual installation. [Chrome distribution settings](https://developer.chrome.com/docs/webstore/cws-dashboard-distribution/)

### Download honestly and provide recovery

The download attribute works for same-origin resources, but actual behavior depends on browser settings and policy. A server Content-Disposition header can influence the filename. An automatic click is an attempt, not proof the file arrived. Host the ZIP on the website origin, set a consistent filename, retain a direct retry link, and say the download “should start.” Avoid repeating the automatic attempt on reload or Back navigation. [MDN anchor download behavior](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a)

### Match the operating system

On macOS, double-clicking expands a ZIP. On Windows, explicitly instruct Extract All: opening the ZIP alone can leave the tester browsing a compressed folder, which is not the directory Chrome needs. Offer a small OS selector so incorrect detection is easy to correct. Keep the extracted folder because the unpacked installation reads its files. [Apple ZIP instructions](https://support.apple.com/en-euro/guide/mac-help/mchlp2528/mac), [Microsoft ZIP instructions](https://support.microsoft.com/en-us/windows/experience/storage-filemanagement/zip-and-unzip-files)

### Keep instructions visible during the task

Contextual help is more useful than a preliminary tutorial that users must remember later. Put each instruction next to its action, and place uncommon troubleshooting behind one disclosure. Recognition also reduces the need to recall unfamiliar interface labels. A small illustration of the actual Developer mode and Load unpacked controls supports that recognition without another paragraph. [NN/g onboarding guidance](https://www.nngroup.com/articles/onboarding-tutorials/), [NN/g recognition and recall](https://www.nngroup.com/articles/recognition-and-recall/)

Numbered steps fit a task whose actions have a required order. Here the whole sequence is short enough to keep on one page; a multi-screen stepper would obscure the checklist when the user switches between Downloads, Chrome, and the website. This is a Sift-specific design inference, rather than a claim that one-page flows always outperform wizards. [GOV.UK step-by-step navigation](https://design-system.service.gov.uk/patterns/step-by-step-navigation/)

### Make feedback accessible

Copy feedback should be exposed as a status message without moving focus. Use native buttons, labels, a selectable input, and visible keyboard focus. If clipboard access fails, select the address and explain the keyboard shortcut instead of claiming success. Make the guide and manual link usable without JavaScript. [WCAG status messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html), [W3C accessibility principles](https://www.w3.org/WAI/fundamentals/accessibility-principles/)

## Page structure

- Compact Sift header and a help link.
- One short headline and download status, with a persistent Download ZIP link.
- Step 1: extract the archive. Small OS selector and a visible keep-the-folder note.
- Step 2: copy chrome://extensions/ and paste it into a new tab.
- Step 3: enable Developer mode, choose Load unpacked, select the extracted folder. A restrained illustration shows the exact Chrome labels.
- Open YouTube action, with a reminder to refresh an existing tab.
- One troubleshooting disclosure, version and manual-update note, privacy and terms links.

Phone visitors receive a desktop handoff and a copy-page action, without an automatic, unusable download. Other browsers receive a Chrome instruction. This deliberately targets a clear, supported installation route instead of presenting a compatibility matrix.

## Packaging and identity

The beta derives from the validated hosted Store build, excludes native messaging, and adds the established development public key. That gives the unpacked installation a stable ID recognized by the current Sift activation flow. The public key is an identity input, not a secret. Google documents the manifest key as the mechanism for consistent extension IDs during development. [Chrome manifest key](https://developer.chrome.com/docs/extensions/reference/manifest/key)

The archive contains manifest.json at its root so ordinary extraction produces the directory Chrome expects. Do not distribute a Vite development bundle: testers should not need a running development server or a native companion. Keep beta and Store packages separately named. The beta ID differs from the published Store ID, so the help section tells existing Store users to disable the old installation. Do not promise automatic migration or updates.

## Alternatives considered

A sign-up-first flow introduces an unrelated task before the tester can see the product. Leave Sift sign-in in the installed product. A wizard requires repeated page interaction without being able to verify actual installation. A video adds playback and scanning effort for three mechanical actions. A long troubleshooting page makes the ordinary path look harder. A browser-internal hyperlink looks convenient but does not reliably navigate from an HTTPS site. These are product judgments grounded in the constraints above, not results from an Sift conversion experiment.

## Verification and limits

The repeatable browser check follows the real landing-page CTA, downloads the ZIP, verifies its bytes, exercises retry and clipboard denial, checks narrow and phone layouts, tests the no-JavaScript link, extracts the exact downloaded archive, and loads it into an isolated Chromium profile. It checks the extension identity and a rendered YouTube fixture. The hosted activation test separately exercises consent, summary, and chat with controlled API responses.

The browser can validate the downloaded package and unpacked extension, but these checks do not establish every native file-manager workflow on Windows or Linux, or that every managed Chrome installation permits Developer mode. The guide uses the vendors' instructions for those seams. Live publication also needs an HTTPS page check, ZIP response headers, and a checksum comparison against the verified artifact.

After release, evaluate where invited testers actually stop before adding more instructions. A small observed installation session is more informative than guessing that another tooltip will improve conversion. Keep any future analytics limited to non-content installation actions and consistent with Sift's privacy commitments.
