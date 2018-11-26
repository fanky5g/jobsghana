package blog

import (
	"github.com/fanky5g/xxxinafrica/web/server/types"
	"bytes"
	"fmt"
	"github.com/lunny/html2md"
	"github.com/microcosm-cc/bluemonday"
	"github.com/russross/blackfriday"
	"golang.org/x/net/html"
	"golang.org/x/net/html/atom"
	"strconv"
	"strings"
)

// CleanTags cleans and slugifies post tags
func CleanTags(tags string) []string {
	var dirty []string
	var out []string

	if tags != "" {
		dirty = strings.Split(tags, ",")
	}

	for _, v := range dirty {
		if v != "" {
			v = strings.Replace(v, " ", "-", -1)
			out = append(out, v)
		}
	}

	return out
}

func markdownToHTML(markdown string) (*html.Node, error) {
	unsafe := blackfriday.Run([]byte(markdown))
	htmlSafe := bluemonday.UGCPolicy().SanitizeBytes(unsafe)

	return html.Parse(strings.NewReader(string(htmlSafe)))
}

func htmlToMarkdown(body *html.Node) (string, error) {
	htmlString, err := nodeToHTML(body)
	if err != nil {
		return "", err
	}

	return strings.TrimSpace(html2md.Convert(htmlString)), nil
}

func nodeToHTML(node *html.Node) (string, error) {
	b := &bytes.Buffer{}
	err := html.Render(b, node)
	if err != nil {
		return "", nil
	}

	return b.String(), nil
}

func resolveImageRefs(n *html.Node, images []types.FileMetadata) {
	if n.Type == html.ElementNode && n.DataAtom == atom.Image {
		var src *html.Attribute
		var alt *html.Attribute

		for i := range n.Attr {
			a := &n.Attr[i]
			if a.Key == "alt" {
				alt = a
			}

			if a.Key == "src" {
				src = a
			}
		}

		if alt != nil && src != nil {
			var indexString string

			if strings.Contains(alt.Val, "-") {
				indexString = strings.Split(alt.Val, "-")[1]
			} else {
				indexString = strings.Split(alt.Val, " ")[1]
			}

			if indexString != "" {
				index, err := strconv.Atoi(indexString)
				if err != nil {
					return
				}

				image := images[index]
				link := parseImageURL(image)
				src.Val = link
			}
		}
	}

	for c := n.FirstChild; c != nil; c = c.NextSibling {
		resolveImageRefs(c, images)
	}
}

// ResolveImageRefs takes markdown string and replaces images with proper links of upload paths
func ResolveImageRefs(images []types.FileMetadata, content string) (string, error) {
	tree, err := markdownToHTML(content)
	if err != nil {
		return "", err
	}

	resolveImageRefs(tree, images)
	marked, err := htmlToMarkdown(tree)
	if err != nil {
		return "", err
	}

	return marked, nil
}

func parseImageURL(image types.FileMetadata) string {
	// default image size for server rendered images to 1024px
	return fmt.Sprintf("https://images.talentsinafrica.com/display?url=%s&op=resize&w=1024", image.URL)
}

func resolveAttachments(images []types.FileMetadata, post types.Post, headerIndex int, headerImage types.FileMetadata, shouldInsertHeader bool) (types.Post, error) {
	if shouldInsertHeader && post.HeaderImageIndex != nil && headerIndex != -1 {
		insert := func(s []types.FileMetadata, at int, val types.FileMetadata) []types.FileMetadata {
			s = append(s[:at+1], s[at:]...)
			s[at] = val
			return s
		}

		if len(images) > 0 {
			images = insert(images, headerIndex, headerImage)
		} else {
			images = append(images, headerImage)
		}
	}

	post.Images = images
	if headerIndex != -1 {
		post.HeaderImageIndex = &headerIndex
	}

	content, err := ResolveImageRefs(images, post.Content)
	if err != nil {
		return types.Post{}, err
	}

	post.Content = content
	return post, nil
}
