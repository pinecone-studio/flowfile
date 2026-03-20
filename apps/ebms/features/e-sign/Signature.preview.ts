function replaceNodeContentsWithSignature(
  documentNode: Document,
  node: Element,
  signatureImageUrl: string,
) {
  node.replaceChildren();

  const image = documentNode.createElement('img');
  image.src = signatureImageUrl;
  image.alt = 'Signature preview';
  image.style.display = 'block';
  image.style.maxWidth = '100%';
  image.style.maxHeight = '72px';
  image.style.objectFit = 'contain';

  node.appendChild(image);
}

export function buildLiveContractPreviewHtml(input: {
  html: string;
  signatureImageUrl: string | null;
  signerRole: string | null | undefined;
  signOrder: number | null | undefined;
  isApproved: boolean;
}) {
  if (!input.signatureImageUrl) {
    return input.html;
  }

  const parsed = new DOMParser().parseFromString(input.html, 'text/html');

  parsed.querySelectorAll('[data-live-signature="document"]').forEach((node) => {
    replaceNodeContentsWithSignature(parsed, node, input.signatureImageUrl!);
  });

  parsed.querySelectorAll('[data-signer-card="true"]').forEach((card) => {
    if (card.getAttribute('data-signer-role') !== (input.signerRole ?? '')) {
      return;
    }

    if (
      input.signOrder != null &&
      card.getAttribute('data-sign-order') !== String(input.signOrder)
    ) {
      return;
    }

    const statusNode = card.querySelector('[data-signer-status="true"]');
    if (statusNode) {
      statusNode.textContent = input.isApproved ? 'Signed' : 'Preview while signing';
      (statusNode as HTMLElement).style.color = input.isApproved
        ? '#2f6c42'
        : '#1d4ed8';
    }

    const signatureSlot = card.querySelector('[data-signature-slot="true"]');
    if (signatureSlot) {
      replaceNodeContentsWithSignature(parsed, signatureSlot, input.signatureImageUrl!);
    }
  });

  return `<!doctype html>\n${parsed.documentElement.outerHTML}`;
}
